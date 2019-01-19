/* @flow */

import type { Bytes } from "@capnp-js/layout";
import type { SegmentB, Word } from "@capnp-js/memory";

import type { ArenaB } from "./index";

import { preallocatedStruct } from "@capnp-js/write-pointers";

import { RefedStruct } from "./guts/struct";

type uint = number;

export default function initStruct(level: uint, arena: ArenaB, ref: Word<SegmentB>, bytes: Bytes): RefedStruct {
  const width = bytes.data + bytes.pointers;
  const object = arena.preallocate(width, ref.segment);
  preallocatedStruct(ref, object, bytes);
  const layout = {
    tag: "struct",
    bytes,
    dataSection: object.position,
    pointersSection: object.position + bytes.data,
    end: object.position + width,
  };
  return new RefedStruct(level, arena, object.segment, layout);
}
