/* @flow */

import type { Bytes } from "@capnp-js/layout";
import type { Pointer, SegmentR, Word } from "@capnp-js/memory";

import type {
  ArenaR,
  CtorR,
  StructCtorR,
  ListListR,
  AnyGutsR,
  StructGutsR,
  BoolListGutsR,
  NonboolListGutsR,
} from "@capnp-js/reader-core";

import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import { isNull } from "@capnp-js/memory";
import { deserializeUnsafe } from "@capnp-js/reader-arena";
import {
  RefedStruct,
  AnyValue,
  StructValue,
  ListValue,
  Data,
  Text,
  lists,
} from "@capnp-js/reader-core";

type i16 = number;
type uint = number;
type u32 = number;

const blob = deserializeUnsafe("EAEAAA");

const consts = {
  "0xd308699fc58b33c0": {
    segment: 0,
    position: 0,
  },
  "0xa7cf3f74af86f9dd": {
    segment: 0,
    position: 0,
  },
  "0xd0f16bd5073acb18": {
    segment: 0,
    position: 0,
  },
};

const defaults = {
  "0xe643b61248892f2d": {
    defAnyS: {
      segment: 0,
      position: 0,
    },
    defAnyL: {
      segment: 0,
      position: 0,
    },
  },
};

/***********/
/* Trivial */
/***********/

export class Trivial__CtorR implements StructCtorR<Trivial__InstanceR> {
  intern(guts: StructGutsR): Trivial__InstanceR {
    return new Trivial__InstanceR(guts);
  }

  fromAny(guts: AnyGutsR): Trivial__InstanceR {
    return new Trivial__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): Trivial__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new Trivial__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | Trivial__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 0 };
  }

  empty(): Trivial__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new Trivial__InstanceR(guts);
  }
}

export class Trivial__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }
}

/*****/
/* a */
/*****/

function getA(): Text {
  const meta = consts["0xd308699fc58b33c0"];
  return Text.deref(0, blob, {
    segment: blob.segment(meta.segment),
    position: meta.position,
  });
}

/*****/
/* b */
/*****/

function getB(): Trivial__InstanceR {
  const meta = consts["0xa7cf3f74af86f9dd"];
  return new Trivial__CtorR().deref(0, blob, {
    segment: blob.segment(meta.segment),
    position: meta.position,
  });
}

/*****/
/* c */
/*****/

function getC(): ListListR<NonboolListGutsR, Text> {
  const meta = consts["0xd0f16bd5073acb18"];
  return lists(Text).deref(0, blob, {
    segment: blob.segment(meta.segment),
    position: meta.position,
  });
}

/*******************/
/* FirstNongeneric */
/*******************/

const FirstNongeneric__Tags = {
  someAnyL: 0,
  someNumber: 1,
};

export class FirstNongeneric__CtorR implements StructCtorR<FirstNongeneric__InstanceR> {
  +tags: {
    +someAnyL: 0,
    +someNumber: 1,
  };
  +FirstGeneric: FirstNongeneric_FirstGeneric__GenericR;
  +I: FirstNongeneric_I__IfaceR;

  constructor() {
    this.tags = FirstNongeneric__Tags;
    this.FirstGeneric = new FirstNongeneric_FirstGeneric__GenericR();
    this.I = new FirstNongeneric_I__IfaceR();
  }

  intern(guts: StructGutsR): FirstNongeneric__InstanceR {
    return new FirstNongeneric__InstanceR(guts);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric__InstanceR {
    return new FirstNongeneric__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 8, pointers: 24 };
  }

  empty(): FirstNongeneric__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric__InstanceR(guts);
  }
}

export class FirstNongeneric__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* someAnyP */
  getSomeAnyP(): null | AnyValue {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : AnyValue.get(this.guts.level, this.guts.arena, ref);
  }

  /* someAnyS */
  getSomeAnyS(): null | StructValue {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : StructValue.get(this.guts.level, this.guts.arena, ref);
  }

  /* someAnyL */
  getSomeAnyL(): null | ListValue {
    this.guts.checkTag(0, 0);
    const ref = this.guts.pointersWord(16);
    return ref === null ? null : ListValue.get(this.guts.level, this.guts.arena, ref);
  }

  /* someNumber */
  getSomeNumber(): u32 {
    this.guts.checkTag(1, 0);
    return (12 ^ decode.int32(this.guts.segment.raw, this.guts.layout.dataSection + 2)) >>> 0;
  }
}

/********************************/
/* FirstNongeneric.FirstGeneric */
/********************************/

export class FirstNongeneric_FirstGeneric__GenericR {
  specialize<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}>(A_1: CtorR<A_1_guts, A_1_r>, B_1: CtorR<B_1_guts, B_1_r>): FirstNongeneric_FirstGeneric__CtorR<A_1_guts, A_1_r, B_1_guts, B_1_r> {
    return new FirstNongeneric_FirstGeneric__CtorR({ A_1, B_1 });
  }
}

export class FirstNongeneric_FirstGeneric__CtorR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}> implements StructCtorR<FirstNongeneric_FirstGeneric__InstanceR> {
  +SecondNongeneric: FirstNongeneric_FirstGeneric_SecondNongeneric__CtorR<A_1_guts, A_1_r, B_1_guts, B_1_r>;

  constructor(params: { +A_1: CtorR<A_1_guts, A_1_r>, +B_1: CtorR<B_1_guts, B_1_r> }) {
    this.SecondNongeneric = new FirstNongeneric_FirstGeneric_SecondNongeneric__CtorR(params);
  }

  intern(guts: StructGutsR): FirstNongeneric_FirstGeneric__InstanceR {
    return new FirstNongeneric_FirstGeneric__InstanceR(guts);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_FirstGeneric__InstanceR {
    return new FirstNongeneric_FirstGeneric__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_FirstGeneric__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_FirstGeneric__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 16 };
  }

  empty(): FirstNongeneric_FirstGeneric__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_FirstGeneric__InstanceR(guts);
  }

  /* Defaults */
  defaultAnyS(): StructValue {
    const meta = defaults["0xe643b61248892f2d"].defAnyS;
    return StructValue.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
  defaultAnyL(): ListValue {
    const meta = defaults["0xe643b61248892f2d"].defAnyL;
    return ListValue.deref(0, blob, {
      segment: blob.segment(meta.segment),
      position: meta.position,
    });
  }
}

export class FirstNongeneric_FirstGeneric__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* defAnyS */
  getDefAnyS(): null | StructValue {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : StructValue.get(this.guts.level, this.guts.arena, ref);
  }

  /* defAnyL */
  getDefAnyL(): null | ListValue {
    const ref = this.guts.pointersWord(16);
    return ref === null ? null : ListValue.get(this.guts.level, this.guts.arena, ref);
  }
}

/*********************/
/* FirstNongeneric.I */
/*********************/

export class FirstNongeneric_I__IfaceR {
  +methods: {
    +p: {
      +Params: FirstNongeneric_I_p__ParamsCtorR,
      +Results: FirstNongeneric_I_p__ResultsCtorR,
    },
  };

  constructor() {
    this.methods = {
      p: {
        Params: new FirstNongeneric_I_p__ParamsCtorR(),
        Results: new FirstNongeneric_I_p__ResultsCtorR(),
      },
    };
  }
}

export class FirstNongeneric_I_p__ParamsCtorR {
  intern(guts: StructGutsR): FirstNongeneric_I_p__ParamsInstanceR {
    return new FirstNongeneric_I_p__ParamsInstanceR(guts);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_I_p__ParamsInstanceR {
    return new FirstNongeneric_I_p__ParamsInstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_I_p__ParamsInstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_I_p__ParamsInstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_I_p__ParamsInstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }

  empty(): FirstNongeneric_I_p__ParamsInstanceR {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_I_p__ParamsInstanceR(guts);
  }
}

export class FirstNongeneric_I_p__ParamsInstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }
}

export class FirstNongeneric_I_p__ResultsCtorR {
  intern(guts: StructGutsR): FirstNongeneric_I_p__ResultsInstanceR {
    return new FirstNongeneric_I_p__ResultsInstanceR(guts);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_I_p__ResultsInstanceR {
    return new FirstNongeneric_I_p__ResultsInstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_I_p__ResultsInstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_I_p__ResultsInstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_I_p__ResultsInstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }

  empty(): FirstNongeneric_I_p__ResultsInstanceR {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_I_p__ResultsInstanceR(guts);
  }
}

export class FirstNongeneric_I_p__ResultsInstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* result */
  getResult(): null | Trivial__InstanceR {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : new Trivial__CtorR().get(this.guts.level, this.guts.arena, ref);
  }
}

/*************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric */
/*************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric__CtorR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}> implements StructCtorR<FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r>> {
  +params: { +A_1: CtorR<A_1_guts, A_1_r>, +B_1: CtorR<B_1_guts, B_1_r> };
  +SecondGeneric: FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__GenericR<B_1_guts, B_1_r>;
  +J: FirstNongeneric_FirstGeneric_SecondNongeneric_J__GenericR<A_1_guts, A_1_r>;

  constructor(params: { +A_1: CtorR<A_1_guts, A_1_r>, +B_1: CtorR<B_1_guts, B_1_r> }) {
    this.params = params;
    this.SecondGeneric = new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__GenericR({ B_1: params.B_1 });
    this.J = new FirstNongeneric_FirstGeneric_SecondNongeneric_J__GenericR({ A_1: params.A_1 });
  }

  intern(guts: StructGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR(guts, this.params);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR(RefedStruct.fromAny(guts), this.params);
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR(guts, this.params);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 8 };
  }

  empty(): FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts, A_1_r> {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR(guts, this.params);
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric__InstanceR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}> {
  +guts: StructGutsR;
  +params: { +A_1: CtorR<A_1_guts, A_1_r> };

  constructor(guts: StructGutsR, params: { +A_1: CtorR<A_1_guts, A_1_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* fg0 */
  getFg0(): null | A_1_r {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : this.params.A_1.get(this.guts.level, this.guts.arena, ref);
  }
}

/***************************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric.SecondGeneric */
/***************************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__GenericR<B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}> {
  +params: { +B_1: CtorR<B_1_guts, B_1_r> };

  constructor(params: { +B_1: CtorR<B_1_guts, B_1_r> }) {
    this.params = params;
  }

  specialize<X_3_guts: AnyGutsR, X_3_r: {+guts: X_3_guts}>(X_3: CtorR<X_3_guts, X_3_r>): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__CtorR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__CtorR({ B_1: this.params.B_1, X_3 });
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__CtorR<B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, X_3_guts: AnyGutsR, X_3_r: {+guts: X_3_guts}> implements StructCtorR<FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r>> {
  +params: { +B_1: CtorR<B_1_guts, B_1_r>, +X_3: CtorR<X_3_guts, X_3_r> };

  constructor(params: { +B_1: CtorR<B_1_guts, B_1_r>, +X_3: CtorR<X_3_guts, X_3_r> }) {
    this.params = params;
  }

  intern(guts: StructGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR(guts, this.params);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR(RefedStruct.fromAny(guts), this.params);
  }

  //TODO: Get for zero width structs implies `null` or a struct?
  //      struct iff offset is nonzero, right?
  //TODO: Switch `this.params` to select the instance's subset.
  //      Consider plugin logic that reuses `this.params` when instance and ctor have equivalent params.
  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR(guts, this.params);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 16 };
  }

  empty(): FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts, B_1_r, X_3_guts, X_3_r> {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR(guts, this.params);
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_SecondGeneric__InstanceR<B_1_guts: AnyGutsR, B_1_r: {+guts: B_1_guts}, X_3_guts: AnyGutsR, X_3_r: {+guts: X_3_guts}> {
  +guts: StructGutsR;
  +params: { +B_1: CtorR<B_1_guts, B_1_r>, +X_3: CtorR<X_3_guts, X_3_r> };

  constructor(guts: StructGutsR, params: { +B_1: CtorR<B_1_guts, B_1_r>, +X_3: CtorR<X_3_guts, X_3_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* sg0 */
  getSg0(): null | B_1_r {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : this.params.B_1.get(this.guts.level, this.guts.arena, ref);
  }

  /* sg1 */
  getSg1(): null | X_3_r {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : this.params.X_3.get(this.guts.level, this.guts.arena, ref);
  }
}

/***************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric.J */
/***************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J__GenericR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}> {
  +params: { +A_1: CtorR<A_1_guts, A_1_r> };

  constructor(params: { +A_1: CtorR<A_1_guts, A_1_r> }) {
    this.params = params;
  }

  //TODO: Rename IfaceR to CtorR
  specialize<Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}>(Y_3: CtorR<Y_3_guts, Y_3_r>): FirstNongeneric_FirstGeneric_SecondNongeneric_J__IfaceR<A_1_guts, A_1_r, Y_3_guts, Y_3_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J__IfaceR({ A_1: this.params.A_1, Y_3 });
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J__IfaceR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}> {
  +params: { +A_1: CtorR<A_1_guts, A_1_r>, +Y_3: CtorR<Y_3_guts, Y_3_r> };
  +methods: {
    +a: {
      +Params: FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsCtorR<A_1_guts, A_1_r, Y_3_guts, Y_3_r>,
      +Results: FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsCtorR,
    },
  };
  +Inner: FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__CtorR;

  constructor(params: { +A_1: CtorR<A_1_guts, A_1_r>, +Y_3: CtorR<Y_3_guts, Y_3_r> }) {
    this.params = params;
    this.methods = {
      a: {
        Params: new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsCtorR({ A_1: this.params.A_1, Y_3: this.params.Y_3 }),
        Results: new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsCtorR(),
      },
    };
    this.Inner = new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__CtorR();
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsCtorR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}> {
  params: { +A_1: CtorR<A_1_guts, A_1_r>, +Y_3: CtorR<Y_3_guts, Y_3_r> };

  constructor(params: { +A_1: CtorR<A_1_guts, A_1_r>, +Y_3: CtorR<Y_3_guts, Y_3_r> }) {
    this.params = params;
  }

  intern(guts: StructGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR<A_1_guts, A_1_r, Y_3_guts, Y_3_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR(guts, { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR<A_1_guts, A_1_r, Y_3_guts, Y_3_r> {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR(RefedStruct.fromAny(guts), { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR<A_1_guts, A_1_r, Y_3_guts, Y_3_r> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR(guts, { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR<A_1_guts, A_1_r, Y_3_guts, Y_3_r> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }

  empty(): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR<A_1_guts, A_1_r, Y_3_guts, Y_3_r> {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR(guts, { A_1: this.params.A_1, Y_3: this.params.Y_3 });
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ParamsInstanceR<A_1_guts: AnyGutsR, A_1_r: {+guts: A_1_guts}, Y_3_guts: AnyGutsR, Y_3_r: {+guts: Y_3_guts}> {
  +guts: StructGutsR;
  +params: { +A_1: CtorR<A_1_guts, A_1_r>, +Y_3: CtorR<Y_3_guts, Y_3_r> };

  constructor(guts: StructGutsR, params: { +A_1: CtorR<A_1_guts, A_1_r>, +Y_3: CtorR<Y_3_guts, Y_3_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* j1 */
  getJ1(): i16 {
    const d = this.guts.layout.dataSection + 0;
    if (d + 2 <= this.guts.layout.pointersSection) {
      return decode.int16(this.guts.segment.raw, d);
    } else {
      return 0;
    }
  }

  /* j2 */
  getJ2(): null | Y_3_r {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : this.params.Y_3.get(this.guts.level, this.guts.arena, ref);
  }

  /* j3 */
  getJ3(): null | A_1_r {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : this.params.A_1.get(this.guts.level, this.guts.arena, ref);
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsCtorR {
  intern(guts: StructGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR(guts);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 24 };
  }

  empty(): FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR(guts);
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_a__ResultsInstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* r1 */
  getR1(): null | Data {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : Data.get(this.guts.level, this.guts.arena, ref);
  }

  /* r2 */
  getR2(): null | AnyValue {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : AnyValue.get(this.guts.level, this.guts.arena, ref);
  }
}

/*********************************************************/
/* FirstNongeneric.FirstGeneric.SecondNongeneric.J.Inner */
/*********************************************************/

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__CtorR implements StructCtorR<FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR> {
  intern(guts: StructGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR(guts);
  }

  fromAny(guts: AnyGutsR): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR(RefedStruct.fromAny(guts));
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR(guts);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 0, pointers: 0 };
  }

  empty(): FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
    const guts = RefedStruct.empty(blob);
    return new FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR(guts);
  }
}

export class FirstNongeneric_FirstGeneric_SecondNongeneric_J_Inner__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }
}

export const Trivial = new Trivial__CtorR();
export const FirstNongeneric = new FirstNongeneric__CtorR();

/*
TODO: Export this to a test (and use real values instead of null(s)).
const trivialR = reader.FirstNongeneric.FirstGeneric.specialize(reader.Trivial, reader.Trivial).SecondNongeneric.intern((null: any)).getFg0();
if (trivialR !== null) {
  const secondNongeneric = builder.FirstNongeneric.FirstGeneric.specialize(builder.Trivial, builder.Trivial).SecondNongeneric.intern((null: any));
  secondNongeneric.setFg0(trivialR);
  const trivialB = secondNongeneric.getFg0();
  if (trivialB !== null) {
    secondNongeneric.setFg0(trivialB);
    secondNongeneric.setFg0(trivialR);
  }
}

const textR = reader.FirstNongeneric.FirstGeneric.specialize(Text, Data).SecondNongeneric.intern((null: any)).getFg0();
if (textR !== null) {
  const secondNongenericB = builder.FirstNongeneric.FirstGeneric.specialize(Text, Text).SecondNongeneric.intern((null: any));
  secondNongenericB.setFg0(textR);
  const textB = secondNongenericB.getFg0();
  if (textB !== null) {
    secondNongenericB.setFg0(textB);
    secondNongenericB.setFg0(textR);
  }
}
*/
