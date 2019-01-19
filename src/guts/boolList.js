/* @flow */

import type { BoolListLayout } from "@capnp-js/layout";
import type { SegmentB, Word } from "@capnp-js/memory";
import type { BoolListGutsR } from "@capnp-js/reader-core";

import type { ArenaB, AnyGutsB } from "../index";

import { PointerTypeError, ListAlignmentError } from "@capnp-js/internal-error";

type uint = number;

export interface BoolListGutsB extends BoolListGutsR {
  +arena: ArenaB;
  +segment: SegmentB;

  set(level: uint, arena: ArenaB, ref: Word<SegmentB>): void;
}

export class InlineBoolList implements BoolListGutsB {
  +level: uint;
  +arena: ArenaB;
  +segment: SegmentB;
  +layout: BoolListLayout;

  static fromAny(guts: AnyGutsB): BoolListGutsB {
    if (guts.layout.tag === "bool list") {
      //TODO: Flow doesn't dig down with this refinement even though it's
      //      unique. Circumvent for now, but try to get it fixed.
      return (guts: any); // eslint-disable-line flowtype/no-weak-types
    } else {
      if (guts.layout.tag === "struct") {
        throw new PointerTypeError(["list"], "struct");
      } else if (guts.layout.tag === "non-bool list") {
        throw new ListAlignmentError("bit aligned", "byte aligned");
      } else {
        (guts.layout.tag: "cap");
        throw new PointerTypeError(["list"], "capability");
      }
    }
  }

  constructor(level: uint, arena: ArenaB, segment: SegmentB, layout: BoolListLayout) {
    this.level = level;
    this.arena = arena;
    this.segment = segment;
    this.layout = layout;
  }

  set(level: uint, arena: ArenaB, ref: Word<SegmentB>): void {
    this.arena.boolListCopy(this.layout, this.segment, level, arena, ref);
  }
}

export class RefedBoolList extends InlineBoolList {
  static deref(level: uint, arena: ArenaB, ref: Word<SegmentB>): this {
    const p = arena.pointer(ref);
    const layout = arena.boolListLayout(p);
    return new this(level, arena, p.object.segment, layout);
  }

  constructor(level: uint, arena: ArenaB, segment: SegmentB, layout: BoolListLayout) {
    super(level+1, arena, segment, layout);
  }
}
