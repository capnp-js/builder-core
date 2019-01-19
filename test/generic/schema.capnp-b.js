/* @flow */

import type { Bytes } from "@capnp-js/layout";
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
import type {
  CtorB,
  StructCtorB,
  ReaderCtor,
  ArenaB,
  StructGutsB,
  AnyGutsB,
} from "@capnp-js/builder-core";

import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import { isNull } from "@capnp-js/memory";
import {
  RefedStruct,
  Orphan,
  AnyValue,
  StructValue,
  ListValue,
  Data,
} from "@capnp-js/builder-core";

import type {
  Trivial__InstanceR,
  FirstNongeneric__InstanceR,
  FirstNongeneric_FirstGeneric__InstanceR,
  FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR,
  FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR,
  FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR,
} from "./schema.capnp-r";

type uint = number;
type i16 = number;
type u32 = number;

/***********/
/* Trivial */
/***********/

export class Trivial__CtorB implements StructCtorB<Trivial__InstanceR, Trivial__InstanceB> {
  fromAny(guts: AnyGutsB): Trivial__InstanceB {
    return new Trivial__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): Trivial__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Trivial__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Trivial__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, Trivial__InstanceR, Trivial__InstanceB> {
    if (isNull(ref)) {
      return null;
    } else {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }
  }

  intern(guts: StructGutsB): Trivial__InstanceB {
    return new Trivial__InstanceB(guts);
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 0 };
  }
}

export class Trivial__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, Trivial__InstanceR>): Trivial__InstanceR {
    return Ctor.intern(this.guts);
  }
}

/*******************/
/* FirstNongeneric */
/*******************/

const FirstNongeneric__Tags = {
  someAnyL: 0,
  someNumber: 1,
};

export class FirstNongeneric__CtorB implements StructCtorB<FirstNongeneric__InstanceR, FirstNongeneric__InstanceB> {
  +tags: {
    +someAnyL: 0,
    +someNumber: 1,
  };
  +FirstGeneric: FirstNongeneric_FirstGeneric__GenericB;
  +I: FirstNongeneric_I__IfaceB;

  constructor() {
    this.tags = FirstNongeneric__Tags;
    this.FirstGeneric = new FirstNongeneric_FirstGeneric__GenericB();
  }

  fromAny(guts: AnyGutsB): FirstNongeneric__InstanceB {
    return new FirstNongeneric__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, FirstNongeneric__InstanceR, FirstNongeneric__InstanceB> {
    if (isNull(ref)) {
      return null;
    } else {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): FirstNongeneric__InstanceB {
    return new FirstNongeneric__InstanceB(guts);
  }

  compiledBytes(): Bytes {
    return { data: 8, pointers: 24 };
  }
}

export class FirstNongeneric__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, FirstNongeneric__InstanceR>): FirstNongeneric__InstanceR {
    return Ctor.intern(this.guts);
  }

  /* someAnyP */
  getSomeAnyP(): null | AnyValue {
    const ref = this.guts.pointersWord(0);
    return AnyValue.get(this.guts.level, this.guts.arena, ref);
  }
  setSomeAnyP(value: AnyValueR | AnyValue): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownSomeAnyP(): null | Orphan<AnyGutsR, AnyValueR, AnyValue> {
    const ref = this.guts.pointersWord(0);
    return AnyValue.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptSomeAnyP(orphan: Orphan<AnyGutsR, AnyValueR, AnyValue>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* someAnyS */
  getSomeAnyS(): null | StructValue {
    const ref = this.guts.pointersWord(8);
    return StructValue.get(this.guts.level, this.guts.arena, ref);
  }
  setSomeAnyS(value: StructValueR | StructValue): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownSomeAnyS(): null | Orphan<StructGutsR, StructValueR, StructValue> {
    const ref = this.guts.pointersWord(8);
    return StructValue.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptSomeAnyS(orphan: Orphan<StructGutsR, StructValueR, StructValue>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* someAnyL */
  getSomeAnyL(): null | ListValue {
    this.guts.checkTag(0, 0);
    const ref = this.guts.pointersWord(16);
    return ListValue.get(this.guts.level, this.guts.arena, ref);
  }
  setSomeAnyL(value: ListValueR | ListValue): void {
    this.guts.setTag(0, 0, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const ref = this.guts.pointersWord(16);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownSomeAnyL(): null | Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, ListValue> {
    const ref = this.guts.pointersWord(16);
    return ListValue.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptSomeAnyL(orphan: Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, ListValue>): void {
    const ref = this.guts.pointersWord(16);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* someNumber */
  getSomeNumber(): u32 {
    this.guts.checkTag(1, 0);
    return (12 ^ decode.int32(this.guts.segment.raw, this.guts.layout.dataSection + 2)) >>> 0;
  }
  setSomeNumber(value: u32): void {
    this.guts.setTag(1, 0, {
      partialDataBytes: [],
      dataBytes: [[2,4]],
      pointersBytes: [[16,8]],
    });
    encode.int32(12 ^ value, this.guts.segment.raw, this.guts.layout.dataSection + 2);
  }
}

/********************************/
/* FirstNongeneric.FirstGeneric */
/********************************/

export class FirstNongeneric_FirstGeneric__GenericB {
  specialize<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>, B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, B_1_b: ReaderCtor<B_1_guts, B_1_r>>(A_1: CtorB<A_1_guts, A_1_r, A_1_b>, B_1: CtorB<B_1_guts, B_1_r, B_1_b>): FirstNongeneric_FirstGeneric__CtorB<A_1_guts, A_1_r, A_1_b, B_1_guts, B_1_r, B_1_b> {
    return new FirstNongeneric_FirstGeneric__CtorB({ A_1, B_1 });
  }
}

export class FirstNongeneric_FirstGeneric__CtorB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>, B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, B_1_b: ReaderCtor<B_1_guts, B_1_r>> implements StructCtorB<FirstNongeneric_FirstGeneric__InstanceR, FirstNongeneric_FirstGeneric__InstanceB> {
  +SecondNongeneric: FirstNongeneric_FirstGeneric_SecondNongeneric__CtorB<A_1_guts, A_1_r, A_1_b, B_1_guts, B_1_r, B_1_b>;

  constructor(params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +B_1: CtorB<B_1_guts, B_1_r, B_1_b> }) {
    this.SecondNongeneric = new FirstNongeneric_FirstGeneric_SecondNongeneric__CtorB(params);
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_FirstGeneric__InstanceB {
    //TODO: `guts` may not have derived from a refed struct, but its alternative name is equally inappropriate (InlineStruct). Consider renaming.
    return new FirstNongeneric_FirstGeneric__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_FirstGeneric__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_FirstGeneric__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, FirstNongeneric_FirstGeneric__InstanceR, FirstNongeneric_FirstGeneric__InstanceB> {
    if (isNull(ref)) {
      return null;
    } else {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): FirstNongeneric_FirstGeneric__InstanceB {
    return new FirstNongeneric_FirstGeneric__InstanceB(guts);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 16 };
  }
}

export class FirstNongeneric_FirstGeneric__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, FirstNongeneric_FirstGeneric__InstanceR>): FirstNongeneric_FirstGeneric__InstanceR {
    return Ctor.intern(this.guts);
  }

  /* defAnyS */
  getDefAnyS(): null | StructValue {
    const ref = this.guts.pointersWord(8);
    return StructValue.get(this.guts.level, this.guts.arena, ref);
  }
  setDefAnyS(value: StructValueR | StructValue): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownDefAnyS(): null | Orphan<StructGutsR, StructValueR, StructValue> {
    const ref = this.guts.pointersWord(8);
    return StructValue.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptDefAnyS(orphan: Orphan<StructGutsR, StructValueR, StructValue>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* defAnyL */
  getDefAnyL(): null | ListValue {
    const ref = this.guts.pointersWord(16);
    return ListValue.get(this.guts.level, this.guts.arena, ref);
  }
  setDefAnyL(value: ListValueR | ListValue): void {
    const ref = this.guts.pointersWord(16);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownDefAnyL(): null | Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, ListValue> {
    const ref = this.guts.pointersWord(16);
    return ListValue.disown(this.guts.level,this.guts.arena, ref);
  }
  adoptDefAnyL(orphan: Orphan<BoolListGutsR | NonboolListGutsR, ListValueR, ListValue>): void {
    const ref = this.guts.pointersWord(16);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

/*********************/
/* FirstNongeneric.I */
/*********************/

export class FirstNongeneric_I__IfaceB {
  +methods: {
    +p: {
      +Params: FirstNongeneric_I_p__ParamsCtorB,
      +Results: FirstNongeneric_I_p__ResultsCtorB,
    },
  };

  constructor() {
    this.methods = {
      p: {
        Params: new FirstNongeneric_I_p__ParamsCtorB(),
        Results: new FirstNongeneric_I_p__ResultsCtorB(),
      },
    };
  }
}

export class FirstNongeneric_I_p__ParamsCtorB {
  intern(guts: StructGutsB): FirstNongeneric_I_p__ParamsInstanceB {
    return new FirstNongeneric_I_p__ParamsInstanceB(guts);
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_I_p__ParamsInstanceB {
    return new FirstNongeneric_I_p__ParamsInstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_I_p__ParamsInstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_I_p__ParamsInstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_I_p__ParamsInstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }
}

export class FirstNongeneric_I_p__ParamsInstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }
}

export class FirstNongeneric_I_p__ResultsCtorB {
  intern(guts: StructGutsB): FirstNongeneric_I_p__ResultsInstanceB {
    return new FirstNongeneric_I_p__ResultsInstanceB(guts);
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_I_p__ResultsInstanceB {
    return new FirstNongeneric_I_p__ResultsInstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_I_p__ResultsInstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_I_p__ResultsInstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_I_p__ResultsInstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }
}

export class FirstNongeneric_I_p__ResultsInstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  /* result */
  getResult(): null | Trivial__InstanceB {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : new Trivial__CtorB().get(this.guts.level, this.guts.arena, ref);
  }
  setDefAnyS(value: Trivial__InstanceR | Trivial__InstanceB): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownDefAnyS(): null | Orphan<StructGutsR, Trivial__InstanceR, Trivial__InstanceB> {
    const ref = this.guts.pointersWord(8);
    return new Trivial__CtorB().disown(this.guts.level, this.guts.arena, ref);
  }
  adoptDefAnyS(orphan: Orphan<StructGutsR, Trivial__InstanceR, Trivial__InstanceB>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

/*************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric */
/*************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric__CtorB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>, B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, B_1_b: ReaderCtor<B_1_guts, B_1_r>> implements StructCtorB<FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r>, FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts, A_1_r, A_1_b>> {
  +params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +B_1: CtorB<B_1_guts, B_1_r, B_1_b> };
  +SecondGeneric: FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__GenericB<B_1_guts, B_1_r, B_1_b>;
  +J: FirstNongeneric_FirstGeneric_SecondNongeneric_J__GenericB<A_1_guts, A_1_r, A_1_b>;

  constructor(params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +B_1: CtorB<B_1_guts, B_1_r, B_1_b> }) {
    this.params = params;
    this.SecondGeneric = new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__GenericB({ B_1: this.params.B_1 });
    this.J = new FirstNongeneric_FirstGeneric_SecondNongeneric_J__GenericB({ A_1: this.params.A_1 });
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts, A_1_r, A_1_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB(RefedStruct.fromAny(guts), this.params);
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts, A_1_r, A_1_b> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB(guts, this.params);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts, A_1_r, A_1_b> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r>, FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts, A_1_r, A_1_b>> {
    if (isNull(ref)) {
      return null;
    } else {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts, A_1_r, A_1_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB(guts, this.params);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 8 };
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>> {
  +guts: StructGutsB;
  +params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b> };

  constructor(guts: StructGutsB, params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b> }) {
    this.guts = guts;
    this.params = params;
  }

  reader(Ctor: CtorR<StructGutsR, FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r>>): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r> {
    return Ctor.intern(this.guts);
  }

  /* fg0 */
  getFg0(): null | A_1_b {
    const ref = this.guts.pointersWord(0);
    return this.params.A_1.get(this.guts.level, this.guts.arena, ref);
  }
  setFg0(value: A_1_r | A_1_b): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownFg0(): null | Orphan<A_1_guts, A_1_r, A_1_b> {
    const ref = this.guts.pointersWord(0);
    return this.params.A_1.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptFg0(orphan: Orphan<A_1_guts, A_1_r, A_1_b>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

/***************************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric.SecondGeneric */
/***************************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__GenericB<B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, B_1_b: ReaderCtor<B_1_guts, B_1_r>> {
  +params: { +B_1: CtorB<B_1_guts, B_1_r, B_1_b> };

  constructor(params: { +B_1: CtorB<B_1_guts, B_1_r, B_1_b> }) {
    this.params = params;
  }

  specialize<X_3_guts: AnyGutsR, X_3_r: {+guts: X_3_guts}, X_3_b: ReaderCtor<X_3_guts, X_3_r>>(X_3: CtorB<X_3_guts, X_3_r, X_3_b>): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__CtorB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__CtorB({ B_1: this.params.B_1, X_3 });
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__CtorB<B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, B_1_b: ReaderCtor<B_1_guts, B_1_r>, X_3_guts: AnyGutsR, X_3_r: {+guts: X_3_guts}, X_3_b: ReaderCtor<X_3_guts, X_3_r>> implements StructCtorB<FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r>, FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b>> {
  +params: { +B_1: CtorB<B_1_guts, B_1_r, B_1_b>, +X_3: CtorB<X_3_guts, X_3_r, X_3_b> };

  constructor(params: { +B_1: CtorB<B_1_guts, B_1_r, B_1_b>, +X_3: CtorB<X_3_guts, X_3_r, X_3_b> }) {
    this.params = params;
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB(RefedStruct.fromAny(guts), this.params);
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB(guts, this.params);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r>, FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b>> {
    if (isNull(ref)) {
      return null;
    } else {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  intern(guts: StructGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts, B_1_r, B_1_b, X_3_guts, X_3_r, X_3_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB(guts, this.params);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 16 };
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceB<B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, B_1_b: ReaderCtor<B_1_guts, B_1_r>, X_3_guts: AnyGutsR, X_3_r: {+guts: X_3_guts}, X_3_b: ReaderCtor<X_3_guts, X_3_r>> {
  +guts: StructGutsB;
  +params: { +B_1: CtorB<B_1_guts, B_1_r, B_1_b>, +X_3: CtorB<X_3_guts, X_3_r, X_3_b> };

  constructor(guts: StructGutsB, params: { +B_1: CtorB<B_1_guts, B_1_r, B_1_b>, +X_3: CtorB<X_3_guts, X_3_r, X_3_b> }) {
    this.guts = guts;
    this.params = params;
  }

  reader(Ctor: CtorR<StructGutsR, FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r>>): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    return Ctor.intern(this.guts);
  }

  /* sg0 */
  getSg0(): null | B_1_b {
    const ref = this.guts.pointersWord(0);
    return this.params.B_1.get(this.guts.level, this.guts.arena, ref);
  }
  setSg0(value: B_1_r | B_1_b): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownSg0(): null | Orphan<B_1_guts, B_1_r, B_1_b> {
    const ref = this.guts.pointersWord(0);
    return this.params.B_1.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptSg0(orphan: Orphan<B_1_guts, B_1_r, B_1_b>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* sg1 */
  getSg1(): null | X_3_b {
    const ref = this.guts.pointersWord(8);
    return this.params.X_3.get(this.guts.level, this.guts.arena, ref);
  }
  setSg1(value: X_3_r | X_3_b): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownSg1(): null | Orphan<X_3_guts, X_3_r, X_3_b> {
    const ref = this.guts.pointersWord(8);
    return this.params.X_3.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptSg1(orphan: Orphan<X_3_guts, X_3_r, X_3_b>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

/***************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric.J */
/***************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J__GenericB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>> {
  +params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b> };

  constructor(params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b> }) {
    this.params = params;
  }

  specialize<Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}, Y_3_b: ReaderCtor<Y_3_guts, Y_3_r>>(Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b>): FirstNongeneric_FirstGeneric_SecondNongeneric_J__IfaceB<A_1_guts, A_1_r, A_1_b, Y_3_guts, Y_3_r, Y_3_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J__IfaceB({ A_1: this.params.A_1, Y_3 });
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J__IfaceB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>, Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}, Y_3_b: ReaderCtor<Y_3_guts, Y_3_r>> {
  +params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b> };
  +methods: {
    +a: {
      +Params: FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsCtorB<A_1_guts, A_1_r, A_1_b, Y_3_guts, Y_3_r, Y_3_b>,
      +Results: FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsCtorB,
    },
  };
  +Inner: FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__CtorB;

  constructor(params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b> }) {
    this.params = params;
    this.methods = {
      a: {
        Params: new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsCtorB({ A_1: this.params.A_1, Y_3: this.params.Y_3 }),
        Results: new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsCtorB(),
      },
    };
    this.Inner = new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__CtorB();
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsCtorB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>, Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}, Y_3_b: ReaderCtor<Y_3_guts, Y_3_r>> {
  params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b> };

  constructor(params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b> }) {
    this.params = params;
  }

  intern(guts: StructGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB<A_1_guts, A_1_r, A_1_b, Y_3_guts, Y_3_r, Y_3_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB(guts, { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB<A_1_guts, A_1_r, A_1_b, Y_3_guts, Y_3_r, Y_3_b> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB(RefedStruct.fromAny(guts), { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB<A_1_guts, A_1_r, A_1_b, Y_3_guts, Y_3_r, Y_3_b> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB(guts, { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB<A_1_guts, A_1_r, A_1_b, Y_3_guts, Y_3_r, Y_3_b> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceB<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, A_1_b: ReaderCtor<A_1_guts, A_1_r>, Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}, Y_3_b: ReaderCtor<Y_3_guts, Y_3_r>> {
  +guts: StructGutsB;
  +params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b> };

  constructor(guts: StructGutsB, params: { +A_1: CtorB<A_1_guts, A_1_r, A_1_b>, +Y_3: CtorB<Y_3_guts, Y_3_r, Y_3_b> }) {
    this.guts = guts;
    this.params = params;
  }

  /* j1 */
  getJ1(): i16 {
    const d = this.guts.layout.dataSection + 0;
    return decode.int16(this.guts.segment.raw, d);
  }
  setJ1(value: i16): void {
    const d = this.guts.layout.dataSection + 0;
    encode.int16(value, this.guts.segment.raw, d);
  }

  /* j2 */
  getJ2(): null | Y_3_b {
    const ref = this.guts.pointersWord(0);
    return this.params.Y_3.get(this.guts.level, this.guts.arena, ref);
  }
  setJ2(value: Y_3_r | Y_3_b): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownJ2(): null | Orphan<Y_3_guts, Y_3_r, Y_3_b> {
    const ref = this.guts.pointersWord(0);
    return this.params.Y_3.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptJ2(orphan: Orphan<Y_3_guts, Y_3_r, Y_3_b>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }

  /* j3 */
  getJ3(): null | A_1_b {
    const ref = this.guts.pointersWord(8);
    return this.params.A_1.get(this.guts.level, this.guts.arena, ref);
  }
  setJ3(value: A_1_r | A_1_b): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownJ3(): null | Orphan<A_1_guts, A_1_r, A_1_b> {
    const ref = this.guts.pointersWord(8);
    return this.params.A_1.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptJ3(orphan: Orphan<A_1_guts, A_1_r, A_1_b>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsCtorB {
  intern(guts: StructGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB(guts);
  }

  fromAny(guts: AnyGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  /* r1 */
  getR1(): null | Data {
    const ref = this.guts.pointersWord(0);
    return Data.get(this.guts.level, this.guts.arena, ref);
  }
  //TODO: Where's the set, adopt, and disown?

  /* r2 */
  getR2(): null | AnyValue {
    const ref = this.guts.pointersWord(0);
    return AnyValue.get(this.guts.level, this.guts.arena, ref);
  }
}

/*********************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric.J.Inner */
/*********************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__CtorB implements StructCtorB<FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR, FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB> {
  fromAny(guts: AnyGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB(guts);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR, FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB> {
    if (isNull(ref)) {
      return null;
    } else {
      const p = arena.pointer(ref);
      arena.zero(ref, 8);
      return new Orphan(this, arena, p);
    }
  }

  intern(guts: StructGutsB): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB(guts);
  }

  validate(p: Pointer<SegmentB>): void {
    RefedStruct.validate(p, this.compiledBytes());
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 0 };
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  reader(Ctor: CtorR<StructGutsR, FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
    return Ctor.intern(this.guts);
  }
}

export const Trivial = new Trivial__CtorB();
export const FirstNongeneric = new FirstNongeneric__CtorB();
