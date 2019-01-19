/* @flow */

import type { Pointer, SegmentB, Word } from "@capnp-js/memory";
import type { AnyGutsR } from "@capnp-js/reader-core";

import type { ArenaB, CtorB, ReaderCtor } from "./index";

import { cap, emptyStruct, nonpreallocated } from "@capnp-js/write-pointers";
import {
  AdoptNonorphanError,
  MoveNonorphanError,
  ExternalOrphanError,
} from "@capnp-js/programmer-error";

class Guts {
  own: null | {|
    +arena: ArenaB,
    +pointer: Pointer<SegmentB>,
  |};

  constructor(arena: ArenaB, pointer: Pointer<SegmentB>) {
    this.own = {
      arena,
      pointer,
    };
  }

  adopt(arena: ArenaB, ref: Word<SegmentB>): void {
    if (this.own === null) {
      throw new AdoptNonorphanError();
    }

    //TODO: This test implies requirements on how many distinct arenas can reference the same data.
    //      Make it work with weaker requirements or document the requirements.
    if (this.own.arena !== arena) {
      throw new ExternalOrphanError(this.own.arena, arena);
    }

    const p = this.own.pointer;
    if (p.typeBits === 0x00 && p.hi === 0x00000000) {
      //TODO: trigger this with a test, yeah?
      emptyStruct(ref);
    } else {
      if (p.typeBits === 0x03) {
        cap(p.hi, ref);
      } else {
        nonpreallocated(arena, ref, p.object, p.typeBits, p.hi);
      }
    }
    this.own = null;
  }
}

/* TODO: This is an old comment. Should it be updated? Clobbered?:
   `Orphan` does not check the orphaned object's type. This is fine because any
   corrupt arena remains corrupt after moving stuff around, while a non-corrupt
   arena remains non-corrupt after moving stuff around. */
export default class Orphan<GUTS: AnyGutsR, R: {+guts: GUTS}, +B: ReaderCtor<GUTS, R>> {
  guts: Guts;

  //TODO: Suppose that pointer.typeBits contradicts the wrapped type.
  //      Suppose that pointer.hi contradicts the wrapped type.
  //      These errors should be caught upon construction, or at least a user's
  //      arena implementation should have an opportunity to catch them.
  constructor(Ctor: CtorB<GUTS, R, B>, arena: ArenaB, p: Pointer<SegmentB>) {
    Ctor.validate(p); //TODO: this method seems destined to repeat the `narrow` static from builder guts. Refactor for a single, unambiguous source of truth.
    this.guts = new Guts(arena, p);
  }

  isDetached(): boolean {
    return this.guts.own !== null;
  }

  move<GUTS_t: GUTS, R_t: {+guts: GUTS_t}, B_t: ReaderCtor<GUTS_t, R_t>>(Target: CtorB<GUTS_t, R_t, B_t>): Orphan<GUTS_t, R_t, B_t> {
    if (this.guts.own === null) {
      throw new MoveNonorphanError();
    }

    const { arena, pointer } = this.guts.own;
    const next = new Orphan(Target, arena, pointer);
    this.guts.own = null;
    return next;
  }
}
