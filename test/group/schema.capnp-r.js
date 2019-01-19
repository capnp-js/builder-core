/* @flow */

import type { Bytes } from "@capnp-js/layout";
import type { Pointer, SegmentR, Word } from "@capnp-js/memory";

import type {
  ArenaR,
  AnyGutsR,
  CtorR,
  StructCtorR,
  StructGutsR,
  NonboolListGutsR,
} from "@capnp-js/reader-core";

import * as decode from "@capnp-js/read-data";
import * as encode from "@capnp-js/write-data";
import { isNull } from "@capnp-js/memory";
import { deserializeUnsafe } from "@capnp-js/reader-arena";
import { RefedStruct, Data } from "@capnp-js/reader-core";

type uint = number;
type u8 = number;
type i8 = number;
type i32 = number;

const blob = deserializeUnsafe("EAEAAA");

/*****/
/* S */
/*****/

export class S__GenericR {
  specialize<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}>(A: CtorR<A_0_guts, A_0_r>, B: CtorR<B_0_guts, B_0_r>): S__CtorR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    return new S__CtorR({ A_0: A, B_0: B });
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
    groups: {
      d: {
        tags: {
          f3: 0,
          paramB: 1,
        },
      },
    },
  },
};

export class S__CtorR<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}> implements StructCtorR<S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r>> {
  +params: { +A_0: CtorR<A_0_guts, A_0_r>, +B_0: CtorR<B_0_guts, B_0_r> };

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
      +groups: {
        +d: {
          +tags: {
            +f3: 0,
            +paramB: 1,
          },
        },
      },
    },
  };

  constructor(params: { +A_0: CtorR<A_0_guts, A_0_r>, +B_0: CtorR<B_0_guts, B_0_r> }) {
    this.tags = S__Tags;
    this.groups = S__Groups;
    this.params = params;
  }

  intern(guts: StructGutsR): S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    return new S__InstanceR(guts, this.params);
  }

  fromAny(guts: AnyGutsR): S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    return new S__InstanceR(RefedStruct.fromAny(guts), this.params);
  }

  deref(level: uint, arena: ArenaR, ref: Word<SegmentR>): S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    const guts = RefedStruct.deref(level, arena, ref, this.compiledBytes());
    return new S__InstanceR(guts, this.params);
  }

  get(level: uint, arena: ArenaR, ref: Word<SegmentR>): null | S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    return isNull(ref) ? null : this.deref(level, arena, ref);
  }

  compiledBytes(): Bytes {
    return { data: 8, pointers: 24 };
  }

  empty(): S__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    const guts = RefedStruct.empty(blob);
    return new S__InstanceR(guts, this.params);
  }
}

export class S__InstanceR<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}> {
  +guts: StructGutsR;
  +params: { +A_0: CtorR<A_0_guts, A_0_r>, +B_0: CtorR<B_0_guts, B_0_r> };

  constructor(guts: StructGutsR, params: { +A_0: CtorR<A_0_guts, A_0_r>, +B_0: CtorR<B_0_guts, B_0_r> }) {
    this.guts = guts;
  }

  /* a */
  getA(): S_a__InstanceR<A_0_guts, A_0_r> {
    return new S_a__InstanceR(this.guts, { A_0: this.params.A_0 });
  }

  /* b */
  getB(): S_b__InstanceR {
    return new S_b__InstanceR(this.guts);
  }

  /* c */
  getC(): S_c__InstanceR<B_0_guts, B_0_r> {
    this.guts.checkTag(2, 2);
    return new S_c__InstanceR(this.guts, { B_0: this.params.B_0 });
  }

  /* g1 */
  getG1(): i8 {
    this.guts.checkTag(0, 6);
    const d = this.guts.layout.dataSection + 0;
    if (d + 1 <= this.guts.layout.pointersSection) {
      return decode.int8(this.guts.segment.raw, d);
    } else {
      return 0 | 0;
    }
  }

  /* e */
  getE(): S_e__InstanceR<A_0_guts, A_0_r, B_0_guts, B_0_r> {
    return new S_e__InstanceR(this.guts, this.params);
  }
}

export class S_a__InstanceR<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}> {
  +guts: StructGutsR;
  +params: { +A_0: CtorR<A_0_guts, A_0_r> };

  constructor(guts: StructGutsR, params: { +A_0: CtorR<A_0_guts, A_0_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* uint8 */
  getUint8(): u8 {
    const d = this.guts.layout.dataSection + 0;
    if (d + 1 <= this.guts.layout.pointersSection) {
      return decode.uint8(this.guts.segment.raw, d);
    } else {
      return 0 >>> 0;
    }
  }

  /* paramA */
  getParamA(): null | A_0_r {
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : this.params.A_0.get(this.guts.level, this.guts.arena, ref);
  }
}

export class S_b__InstanceR {
  +guts: StructGutsR;

  constructor(guts: StructGutsR) {
    this.guts = guts;
  }

  /* int32 */
  getInt32(): i32 {
    const d = this.guts.layout.dataSection + 4;
    if (d + 4 <= this.guts.layout.pointersSection) {
      return decode.int32(this.guts.segment.raw, d);
    } else {
      return 0 | 0;
    }
  }

  /* data */
  getData(): null | Data {
    const ref = this.guts.pointersWord(8);
    return ref === null ? null : Data.get(this.guts.level, this.guts.arena, ref);
  }
}

const S_c__Tags = {
  f1: 0,
  f2: 1,
  d: 2,
};

export class S_c__InstanceR<B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}> { //TODO: add +tags field and tag() methods for test class unions
  +guts: StructGutsR;
  +params: { +B_0: CtorR<B_0_guts, B_0_r> };

  constructor(guts: StructGutsR, params: { +B_0: CtorR<B_0_guts, B_0_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* f1 */
  getF1(): i8 {
    this.guts.checkTag(0, 2);
    const d = this.guts.layout.dataSection + 1;
    if (d + 1 <= this.guts.layout.pointersSection) {
      return decode.int8(this.guts.segment.raw, d);
    } else {
      return 0 | 0;
    }
  }

  /* f2 */
  getF2(): i8 {
    this.guts.checkTag(1, 2);
    const d = this.guts.layout.dataSection + 1;
    if (d + 1 <= this.guts.layout.pointersSection) {
      return decode.int8(this.guts.segment.raw, d);
    } else {
      return 0 | 0;
    }
  }

  /* d */
  getD(): S_c_d__InstanceR<B_0_guts, B_0_r> {
    return new S_c_d__InstanceR(this.guts, this.params);
  }
}

const S_c_d__Tags = {
  f3: 0,
  paramB: 1,
};

export class S_c_d__InstanceR<B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}> {
  +guts: StructGutsR;
  +params: { +B_0: CtorR<B_0_guts, B_0_r> };

  constructor(guts: StructGutsR, params: { +B_0: CtorR<B_0_guts, B_0_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* f3 */
  getF3(): i8 {
    this.guts.checkTag(0, 4);
    const d = this.guts.layout.dataSection + 1;
    if (d + 1 < this.guts.layout.pointersSection) {
      return decode.int8(this.guts.segment.raw, d);
    } else {
      return 0 | 0;
    }
  }

  /* paramB */
  getParamB(): null | B_0_r {
    this.guts.checkTag(1, 4);
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : this.params.B_0.get(this.guts.level, this.guts.arena, ref);
  }
}

export class S_e__InstanceR<A_0_guts: AnyGutsR, A_0_r: {+guts: A_0_guts}, B_0_guts: AnyGutsR, B_0_r: {+guts: B_0_guts}> {
  +guts: StructGutsR;
  +params: { +A_0: CtorR<A_0_guts, A_0_r>, +B_0: CtorR<B_0_guts, B_0_r> };

  constructor(guts: StructGutsR, params: { +A_0: CtorR<A_0_guts, A_0_r>, +B_0: CtorR<B_0_guts, B_0_r> }) {
    this.guts = guts;
    this.params = params;
  }

  /* g2 */
  getG2(): i8 {
    this.guts.checkTag(1, 6);
    this.guts.checkTag(0, 8);
    const d = this.guts.layout.dataSection + 1;
    if (d + 1 < this.guts.layout.pointersSection) {
      return decode.int8(this.guts.segment.raw, d);
    } else {
      return 0 | 0;
    }
  }

  /* paramB */
  getParamB(): null | B_0_r {
    this.guts.checkTag(1, 6);
    this.guts.checkTag(1, 8);
    const ref = this.guts.pointersWord(0);
    return ref === null ? null : this.params.B_0.get(this.guts.level, this.guts.arena, ref);
  }
}

export const S = new S__GenericR();
