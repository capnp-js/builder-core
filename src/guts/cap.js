/* @flow */

import type { CapGutsR } from "@capnp-js/reader-core";
import type { SegmentB, Word } from "@capnp-js/memory";
import type { CapLayout } from "@capnp-js/layout";

import type { ArenaB, AnyGutsB } from "../index";

import { PointerTypeError } from "@capnp-js/internal-error";
import { cap } from "@capnp-js/write-pointers";

export interface CapGutsB extends CapGutsR {}

//TODO: I implemented the builder implementation of reader under the mistaken belief that the reuse of the reader side caused an error.
//      After the effort I didn't have the heart to clobber it, anticipating using this at some point in the future.
//      Once everything has stabilized somewhat, consider clobbering this file and basing everything on the reader side again.

type uint = number;

export class Cap implements CapGutsB {
  +layout: CapLayout;

  static fromAny(guts: AnyGutsB): CapGutsB {
    if (guts.layout.tag === "cap") {
      return (guts: any); // eslint-disable-line flowtype/no-weak-types
    } else {
      if (guts.layout.tag === "struct") {
        throw new PointerTypeError(["capability"], "struct");
      } else if (guts.layout.tag === "bool list") {
        throw new PointerTypeError(["capability"], "list");
      } else {
        //TODO: Get Flow to refine this: (guts.layout.tag: "non-bool list");
        throw new PointerTypeError(["capability"], "list");
      }
    }
  }

  constructor(layout: CapLayout) {
    this.layout = layout;
  }

  set(level: uint, arena: ArenaB, ref: Word<SegmentB>): void {
    cap(this.layout.index, ref);
  }
}
