/* @flow */

import type { Pointer, SegmentB, Word } from "@capnp-js/memory";

import type {
  CtorR,
  StructGutsR,
  BoolListGutsR,
  NonboolListGutsR,
  AnyGutsR,
  AnyValue as AnyValueR,
  StructValue as StructValueR,
  ListValue as ListValueR,
} from "@capnp-js/reader-core";
//TODO: Ideally I'd like only types imported from the reader side so that bundles can possibly exclude reader-core

import type {
  ArenaB,
  AnyGutsB,
  CtorB,
  StructCtorB,
  WeakListCtorB,
  ReaderCtor,
} from "./index";

import type { StructGutsB } from "./guts/struct";
import type { BoolListGutsB } from "./guts/boolList";
import type { NonboolListGutsB } from "./guts/nonboolList";

import { isNull } from "@capnp-js/memory";
import { u3_mask } from "@capnp-js/tiny-uint";

//TODO: My internal/programmer categories overlap for PointerTypeError. Can I disambiguate into two types?
//      I could have miscast, or somebody else could have encoded some BS.
import { PointerTypeError } from "@capnp-js/internal-error";
import { MoveNonorphanError } from "@capnp-js/programmer-error";

import Orphan from "./Orphan";

import { Cap } from "./guts/cap";
import { RefedStruct } from "./guts/struct";
import { RefedBoolList } from "./guts/boolList";
import { RefedNonboolList } from "./guts/nonboolList";

type uint = number;

export class AnyValue {
  +guts: AnyGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(guts);
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const p = arena.pointer(ref);
    switch (p.typeBits) {
    case 0x00:
      const struct = new RefedStruct(level, arena, p.object.segment, arena.genericStructLayout(p));
      return new this(struct);
    case 0x01:
      const listTypeBits = u3_mask(p.hi, 0x07);
      if (listTypeBits === 0x01) {
        const bool = new RefedBoolList(level, arena, p.object.segment, arena.boolListLayout(p));
        return new this(bool);
      } else {
        const nonbool = new RefedNonboolList(level, arena, p.object.segment, arena.genericNonboolListLayout(p));
        return new this(nonbool);
      }
    default:
      (p.typeBits: 0x03);
      const cap = new Cap(arena.capLayout(p));
      return new this(cap);
    }
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<AnyGutsR, AnyValueR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<AnyGutsR, AnyValueR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void { // eslint-disable-line no-unused-vars
    //TODO: Does the capability type currently work well with this?
  }

  static seizeOrphan<GUTS: AnyGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(orphan: Orphan<GUTS, R, B>): Orphan<AnyGutsR, AnyValueR, AnyValue> {
    if (orphan.guts.own === null) {
      throw new MoveNonorphanError();
    }

    const { arena, pointer } = orphan.guts.own;
    const next = new Orphan(this, arena, pointer);
    orphan.guts.own = null;
    return next;
  }

  constructor(guts: AnyGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<AnyGutsR, AnyValueR>): AnyValueR {
    return Ctor.intern(this.guts);
  }

  //TODO: Support getAs for reader variants too?
  getAs<GUTS: AnyGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(Ctor: CtorB<GUTS, R, B>): B {
    return Ctor.fromAny(this.guts);
  }
}
(AnyValue: CtorB<AnyGutsR, AnyValueR, AnyValue>);

export class StructValue {
  +guts: StructGutsB;

  static fromAny(guts: AnyGutsB): this {
    return new this(RefedStruct.fromAny(guts));
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const p = arena.pointer(ref);
    const guts = new RefedStruct(level, arena, p.object.segment, arena.genericStructLayout(p));
    return new this(guts);
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    //TODO: Do RefedBoolList and RefedNonboolList check that the pointer is a list pointer? 
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<StructGutsR, StructValueR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, StructValueR, this> {
    return isNull(ref) ? null : this.unref(level, arena, ref);
  }

  static validate(p: Pointer<SegmentB>): void {
    if (p.typeBits !== 0x00) {
      if (p.typeBits === 0x01) {
        throw new PointerTypeError(["struct"], "list");
      } else {
        (p.typeBits: 0x03);
        throw new PointerTypeError(["struct"], "capability");
      }
    }
  }

  static seizeOrphan<GUTS: StructGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(orphan: Orphan<GUTS, R, B>): Orphan<StructGutsR, StructValueR, StructValue> {
    if (orphan.guts.own === null) {
      throw new MoveNonorphanError();
    }

    const { arena, pointer } = orphan.guts.own;
    const next = new Orphan(this, arena, pointer);
    orphan.guts.own = null;
    return next;
  }

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, StructValueR>): StructValueR {
    return Ctor.intern(this.guts);
  }

  getAs<R: {+guts: StructGutsR}, B: ReaderCtor<StructGutsR, R>>(Ctor: StructCtorB<R, B>): B {
    //TODO: This is a good opportunity to detect illegal upgrades, incompatible types, etc. Do some error checking here. Or in intern.
    return Ctor.intern(this.guts); //TODO: Consider another method, like `safeIntern`, if guts doesn't need narrowing.
  }
}
(StructValue: CtorB<StructGutsR, StructValueR, StructValue>);

export class ListValue {
  +guts: BoolListGutsB | NonboolListGutsB;

  static fromAny(guts: AnyGutsB): this {
    if (guts.layout.tag === "bool list" || guts.layout.tag === "non-bool list") {
      return new this((guts: any)); // eslint-disable-line flowtype/no-weak-types
    } else {
      if (guts.layout.tag === "struct") {
         //TODO: This stretches the UnexpectedPointerType name. UnexpectedType works.
        throw new PointerTypeError(["list"], "struct");
      } else {
        //TODO: This stretches the UnexpectedPointerType name. UnexpectedType works.
        //TODO: Flow refinement needs to dig down to make this work:
        //      (guts.layout.tag: "capability");
        throw new PointerTypeError(["list"], "capability");
      }
    }
  }

  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const p = arena.pointer(ref);
    const listTypeBits = u3_mask(p.hi, 0x07);
    if (listTypeBits === 0x01) {
      const guts = new RefedBoolList(level, arena, p.object.segment, arena.boolListLayout(p));
      return new this(guts);
    } else {
      const guts = new RefedNonboolList(level, arena, p.object.segment, arena.genericNonboolListLayout(p));
      return new this(guts);
    }
  }

  static get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | this {
    //TODO: Do RefedBoolList and RefedNonboolList check that the pointer is a list pointer? 
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  static unref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, this> {
    const p = arena.pointer(ref);
    arena.zero(ref, 8);
    return new Orphan(this, arena, p);
  }

  static disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, this> {
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
  }

  static seizeOrphan<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(orphan: Orphan<GUTS, R, B>): Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, ListValue> {
    if (orphan.guts.own === null) {
      throw new MoveNonorphanError();
    }

    const { arena, pointer } = orphan.guts.own;
    const next = new Orphan(this, arena, pointer);
    orphan.guts.own = null;
    return next;
  }

  constructor(guts: BoolListGutsB | NonboolListGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<BoolListGutsR | NonboolListGutsR, ListValueR>): ListValueR {
    return Ctor.intern(this.guts);
  }

  getAs<GUTS: BoolListGutsR | NonboolListGutsR, R: {+guts: GUTS}, B: ReaderCtor<GUTS, R>>(Ctor: WeakListCtorB<GUTS, R, B>): B {
    return Ctor.fromAny(this.guts);
  }
}
(ListValue: CtorB<BoolListGutsR | NonboolListGutsR, ListValueR, ListValue>);

//TODO: Try to getAs a CapValue reader from within a builder struct. If that
//      proves impossible, then introduce a CapValue over here.
