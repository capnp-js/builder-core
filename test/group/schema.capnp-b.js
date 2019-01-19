/* @flow */

import type { Bytes } from "@capnp-js/layout";
import type { Pointer, SegmentB, Word } from "@capnp-js/memory";
import type {
  AnyGutsR,
  CtorR,
  StructGutsR,
  NonboolListGutsR,
  Data as DataR,
} from "@capnp-js/reader-core";
import type {
  CtorB,
  StructCtorB,
  ReaderCtor,
  ArenaB,
  StructGutsB,
  AnyGutsB,
} from "@capnp-js/builder-core";

import type { S__InstanceR } from "./schema.capnp-r.js";

import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import {
  RefedStruct,
  Orphan,
  Data,
} from "@capnp-js/builder-core";
import { isNull } from "@capnp-js/memory";

type uint = number;
type u8 = number;
type i8 = number;
type i32 = number;

/*****/
/* S */
/*****/

export class S__GenericB {
  specialize<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, A_0_b: ReaderCtor<A_0_guts, A_0_r>, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}, B_0_b: ReaderCtor<B_0_guts, B_0_r>>(A: CtorB<A_0_guts, A_0_r, A_0_b>, B: CtorB<B_0_guts, B_0_r, B_0_b>): S__CtorB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b> {
    return new S__CtorB({ A_0: A, B_0: B });
  }
}

const S__Tags = {
  c: 0,
  g1: 1,
  e: 2,
};

const S__Groups = {
  a: {},
  b: {},
  c: {
    tags: {
      f1: 0,
      f2: 1,
      d: 2,
    },
    d: {
      tags: {
        f3: 0,
        paramB: 1,
      },
    },
  },
};

export class S__CtorB<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, A_0_b: ReaderCtor<A_0_guts, A_0_r>, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}, B_0_b: ReaderCtor<B_0_guts, B_0_r>> implements StructCtorB<S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r>, S__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b>> {
  +tags: {
    +c: 0,
    +g1: 1,
    +e: 2,
  };
  +groups: {
    +a: {},
    +b: {},
    +c: {
      +tags: {
        +f1: 0,
        +f2: 1,
        +d: 2,
      },
      +d: {
        +tags: {
          +f3: 0,
          +paramB: 1,
        },
      },
    },
  };
  +params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b>, +B_0: CtorB<B_0_guts, B_0_r, B_0_b> };

  constructor(params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b>, +B_0: CtorB<B_0_guts, B_0_r, B_0_b> }) {
    this.tags = S__Tags;
    this.groups = S__Groups;
    this.params = params;
  }

  fromAny(guts: AnyGutsB): S__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b> {
    return new S__InstanceB(RefedStruct.fromAny(guts), this.params);
  }

  deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): S__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new S__InstanceB(guts, this.params);
  }

  get(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | S__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  disown(level: uint, arena: ArenaB, ref: Word<SegmentB>): null | Orphan<StructGutsR, S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r>, S__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b>> {
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

  intern(guts: StructGutsB): S__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b> {
    return new S__InstanceB(guts, this.params);
  }

  compiledBytes(): Bytes {
    return { data: 8, pointers: 24 };
  }
}

export class S__InstanceB<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, A_0_b: ReaderCtor<A_0_guts, A_0_r>, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}, B_0_b: ReaderCtor<B_0_guts, B_0_r>> {
  +guts: StructGutsB;
  +params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b>, +B_0: CtorB<B_0_guts, B_0_r, B_0_b> };

  constructor(guts: StructGutsB, params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b>, +B_0: CtorB<B_0_guts, B_0_r, B_0_b> }) {
    this.guts = guts;
    this.params = params;
  }

  reader(Ctor: CtorR<StructGutsR, S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r>>): S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    return Ctor.intern(this.guts);
  }

  /* a */
  getA(): S_a__InstanceB<A_0_guts, A_0_r, A_0_b> {
    return new S_a__InstanceB(this.guts, { A_0: this.params.A_0 });
  }

  /* b */
  getB(): S_b__InstanceB {
    return new S_b__InstanceB(this.guts);
  }

  /* c */
  getC(): S_c__InstanceB<B_0_guts, B_0_r, B_0_b> {
    this.guts.checkTag(2, 2);
    return new S_c__InstanceB(this.guts, { B_0: this.params.B_0 });
  }

  /* g1 */
  getG1(): i8 {
    this.guts.checkTag(0, 6);
    const d = this.guts.layout.dataSection + 0;
    return decode.int8(this.guts.segment.raw, d);
  }
  setG1(value: i8): void {
    this.guts.setTag(0, 6, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const d = this.guts.layout.dataSection + 0;
    encode.int8(value, this.guts.segment.raw, d);
  }

  /* e */
  getE(): S_e__InstanceB<A_0_guts, A_0_r, A_0_b, B_0_guts, B_0_r, B_0_b> {
    return new S_e__InstanceB(this.guts, this.params);
  }
}

export class S_a__InstanceB<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, A_0_b: ReaderCtor<A_0_guts, A_0_r>> {
  +guts: StructGutsB;
  +params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b> };

  constructor(guts: StructGutsB, params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b> }) {
    this.guts = guts;
    this.params = params;
  }

  /* uint8 */
  getUint8(): u8 {
    const d = this.guts.layout.dataSection + 0;
    return decode.uint8(this.guts.segment.raw, d);
  }
  setUint8(value: u8): void {
    const d = this.guts.layout.dataSection + 0;
    encode.uint8(value, this.guts.segment.raw, d);
  }

  /* paramA */
  getParamA(): null | A_0_b {
    const ref = this.guts.pointersWord(0);
    return this.params.A_0.get(this.guts.level, this.guts.arena, ref);
  }
  setParamA(value: A_0_r | A_0_b): void {
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownParamA(): null | Orphan<A_0_guts, A_0_r, A_0_b> {
    const ref = this.guts.pointersWord(0);
    return this.params.A_0.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptParamA(orphan: Orphan<A_0_guts, A_0_r, A_0_b>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

export class S_b__InstanceB {
  +guts: StructGutsB;

  constructor(guts: StructGutsB) {
    this.guts = guts;
  }

  /* int32 */
  getInt32(): i32 {
    const d = this.guts.layout.dataSection + 4;
    return decode.int32(this.guts.segment.raw, d);
  }
  setInt32(value: i32): void {
    const d = this.guts.layout.dataSection + 4;
    encode.int32(value, this.guts.segment.raw, d);
  }

  /* data */
  getData(): null | Data {
    const ref = this.guts.pointersWord(8);
    return Data.get(this.guts.level, this.guts.arena, ref);
  }
  setData(value: DataR | Data): void {
    const ref = this.guts.pointersWord(8);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownData(): null | Orphan<NonboolListGutsR, DataR, Data> {
    const ref = this.guts.pointersWord(8);
    return Data.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptData(orphan: Orphan<NonboolListGutsR, DataR, Data>): void {
    const ref = this.guts.pointersWord(8);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

const S_c__Tags = {
  f1: 0,
  f2: 1,
  d: 2,
};

export class S_c__InstanceB<B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}, B_0_b: ReaderCtor<B_0_guts, B_0_r>> {
  +guts: StructGutsB;
  +params: { +B_0: CtorB<B_0_guts, B_0_r, B_0_b> };

  constructor(guts: StructGutsB, params: { +B_0: CtorB<B_0_guts, B_0_r, B_0_b> }) {
    this.guts = guts;
    this.params = params;
  }

  /* f1 */
  getF1(): i8 {
    this.guts.checkTag(0, 2);
    const d = this.guts.layout.dataSection + 1;
    return decode.int8(this.guts.segment.raw, d);
  }
  setF1(value: i8): void {
    this.guts.setTag(0, 2, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    }); //TODO: Add setUnionTag with a union layout parameter?
    const d = this.guts.layout.dataSection + 1;
    encode.int8(value, this.guts.segment.raw, d);
  }

  /* f2 */
  getF2(): i8 {
    this.guts.checkTag(1, 2);
    const d = this.guts.layout.dataSection + 1;
    return decode.int8(this.guts.segment.raw, d);
  }
  setF2(value: i8): void {
    this.guts.setTag(1, 2, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const d = this.guts.layout.dataSection + 1;
    encode.int8(value, this.guts.segment.raw, d);
  }

  /* d */
  getD(): S_c_d__InstanceB<B_0_guts, B_0_r, B_0_b> {
    return new S_c_d__InstanceB(this.guts, this.params);
  }
}

const S_c_d__Tags = {
  f3: 0,
  paramB: 1,
};

export class S_c_d__InstanceB<B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}, B_0_b: ReaderCtor<B_0_guts, B_0_r>> {
  +guts: StructGutsB;
  +params: { +B_0: CtorB<B_0_guts, B_0_r, B_0_b> };

  constructor(guts: StructGutsB, params: { +B_0: CtorB<B_0_guts, B_0_r, B_0_b> }) {
    this.guts = guts;
    this.params = params;
  }

  /* f3 */
  getF3(): i8 {
    this.guts.checkTag(0, 4);
    const d = this.guts.layout.dataSection + 1;
    return decode.int8(this.guts.segment.raw, d);
  }
  setF3(value: i8): void {
    //TODO: Generated code needs to zero the paramB pointer, right?
    this.guts.setTag(0, 4, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const d = this.guts.layout.dataSection + 1;
    encode.int8(value, this.guts.segment.raw, d);
  }

  /* paramB */
  getParamB(): null | B_0_b {
    this.guts.checkTag(1, 4);
    const ref = this.guts.pointersWord(0);
    return this.params.B_0.get(this.guts.level, this.guts.arena, ref);
  }
  setParamB(value: B_0_r | B_0_b): void {
    this.guts.setTag(1, 4, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownParamB(): null | Orphan<B_0_guts, B_0_r, B_0_b> {
    //TODO: How these methods interlace checks with other calls imposes constraints on when guts.arena may throw.
    //      Reconcile the spec of arena and the implementation of these methods to avoid bugs.
    this.guts.checkTag(1, 4);
    const ref = this.guts.pointersWord(0);
    return this.params.B_0.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptParamB(orphan: Orphan<B_0_guts, B_0_r, B_0_b>): void {
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

export class S_e__InstanceB<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, A_0_b: ReaderCtor<A_0_guts, A_0_r>, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}, B_0_b: ReaderCtor<B_0_guts, B_0_r>> {
  +guts: StructGutsB;
  +params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b>, +B_0: CtorB<B_0_guts, B_0_r, B_0_b> };

  constructor(guts: StructGutsB, params: { +A_0: CtorB<A_0_guts, A_0_r, A_0_b>, +B_0: CtorB<B_0_guts, B_0_r, B_0_b> }) {
    this.guts = guts;
    this.params = params;
  }

  /* g2 */
  getG2(): i8 {
    this.guts.checkTag(1, 6);
    this.guts.checkTag(0, 8);
    const d = this.guts.layout.dataSection + 1;
    return decode.int8(this.guts.segment.raw, d);
  }
  setG2(value: i8): void {
    this.guts.checkTag(1, 6);
    this.guts.setTag(0, 8, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const d = this.guts.layout.dataSection + 1;
    encode.int8(value, this.guts.segment.raw, d);
  }

  /* paramB */
  getParamB(): null | B_0_b {
    this.guts.checkTag(1, 6);
    this.guts.checkTag(1, 8);
    const ref = this.guts.pointersWord(0);
    return this.params.B_0.get(this.guts.level, this.guts.arena, ref);
  }
  setParamB(value: B_0_r | B_0_b): void {
    this.guts.checkTag(1, 6);
    this.guts.setTag(1, 8, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const ref = this.guts.pointersWord(0);
    value.guts.set(this.guts.level, this.guts.arena, ref);
  }
  disownFg0(): null | Orphan<B_0_guts, B_0_r, B_0_b> {
    this.guts.checkTag(1, 6);
    this.guts.checkTag(1, 8);
    const ref = this.guts.pointersWord(0);
    return this.params.B_0.disown(this.guts.level, this.guts.arena, ref);
  }
  adoptFg0(orphan: Orphan<B_0_guts, B_0_r, B_0_b>): void {
    this.guts.checkTag(1, 6);
    this.guts.setTag(1, 8, {
      partialDataBytes: [],
      dataBytes: [],
      pointersBytes: [],
    });
    const ref = this.guts.pointersWord(0);
    orphan.guts.adopt(this.guts.arena, ref);
  }
}

export const S = S__GenericB;
