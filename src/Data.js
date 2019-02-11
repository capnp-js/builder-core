/* @flow */

import type { BytesB } from "@capnp-js/bytes";
import type { NonboolListEncoding } from "@capnp-js/layout";
import type { Pointer, SegmentB, Word } from "@capnp-js/memory";
import type {
  CtorR,
  Data as DataR,
  NonboolListGutsR,
} from "@capnp-js/reader-core";

import type { ArenaB, AnyGutsB, ListCtorB } from "./index";

import type { NonboolListGutsB } from "./guts/nonboolList";

import { PointerTypeError, ListAlignmentError } from "@capnp-js/internal-error";
import { isStaleList, listEncodings } from "@capnp-js/layout";
import { isNull } from "@capnp-js/memory";
import { inlineCompositeEncoding } from "@capnp-js/read-pointers";
import { u3_mask } from "@capnp-js/tiny-uint";

import Orphan from "./Orphan";

import { RefedNonboolList } from "./guts/nonboolList";

type uint = number;

export default class Data {
  +guts: NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    //TODO: getAs implementation of ListValue should check for illegal upgrades and illegal casts, because the type system lacks the granularity, right?
    return new this(RefedNonboolList.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const p = arena.pointer(ref);
    const layout = arena.blobLayout(p);
    const guts = new RefedNonboolList(level, arena, p.object.segment, layout);
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<NonboolListGutsR, DataR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<NonboolListGutsR, DataR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x01) {
      if (p.typeBits === 0x00) {
        throw new PointerTypeError(["list"], "struct");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["list"], "capability");
      }
    }

    const c = u3_mask(p.hi, 0x07);
    if (c === 0x01) {
      throw new ListAlignmentError("byte aligned", "bit aligned");
    } else {
      const encoding = c === 0x07 ? inlineCompositeEncoding(p) : listEncodings[c];
      isStaleList(this.encoding(), encoding);
    }
  }

  static encoding(): NonboolListEncoding {
    return listEncodings[0x02];
  }

  constructor(guts: NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<NonboolListGutsR, DataR>): DataR {
    return Ctor.intern(this.guts);
  }

  asBytes(): BytesB {
    const end = this.guts.layout.begin + this.guts.layout.length;
    return this.guts.segment.raw.subarray(this.guts.layout.begin, end);
  }
}
(Data: ListCtorB<NonboolListGutsR, DataR, Data>);
