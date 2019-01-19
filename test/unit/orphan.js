/* @flow */

import test from "ava";

//TODO: Re-export Unlimited in this package's index?
import { Unlimited } from "@capnp-js/base-arena";
import { Builder } from "@capnp-js/builder-arena";
import { root } from "@capnp-js/memory";
import { PointerTypeError } from "@capnp-js/internal-error";
import { AdoptNonorphanError } from "@capnp-js/programmer-error";
import {
  Orphan,
  Text,
  UInt8List,
  AnyValue,
  StructValue,
  ListValue,
} from "@capnp-js/builder-core";

import * as reader from "../generic/schema.capnp-r";
import * as builder from "../generic/schema.capnp-b";

/* The `nonpreallocated` unit tests capture single-hop and double-hop far
   pointers, so no need to repeat that work here. */

test("adopt struct", t => {
  t.plan(4);

  const arena = Builder.fresh(32, new Unlimited());
  const object = arena.allocate(32);
  const p = {
    typeBits: 0x00,
    hi: (0x03<<16) | 0x01,
    object,
  };
  const orphan = new Orphan(builder.Trivial, arena, p);
  t.true(orphan.isDetached());
  orphan.guts.adopt(arena, root(arena));
  t.false(orphan.isDetached());
  t.deepEqual(arena.pointer(root(arena)), p);
  t.throws(() => {
    orphan.guts.adopt(arena, root(arena));
  }, AdoptNonorphanError);
});

test("move struct", t => {
  t.plan(16);

  const arena = Builder.fresh(2048, new Unlimited());
  const SN = builder.FirstNongeneric.FirstGeneric.specialize(Text, StructValue).SecondNongeneric;
  const SG = SN.SecondGeneric.specialize(builder.Trivial);
  const sg = arena.initRoot(SG);
  let trivialOrphan = arena.initStruct(builder.Trivial);

  t.true(trivialOrphan.isDetached());
  const structOrphan = StructValue.seizeOrphan(trivialOrphan);
  t.false(trivialOrphan.isDetached());
  t.true(structOrphan.isDetached());
  trivialOrphan = structOrphan.move(builder.Trivial);
  t.true(trivialOrphan.isDetached());
  t.false(structOrphan.isDetached());
  sg.adoptSg1(trivialOrphan);
  t.false(trivialOrphan.isDetached());

  trivialOrphan = sg.disownSg1();
  t.not(trivialOrphan, null);
  if (trivialOrphan !== null) {
    t.true(trivialOrphan.isDetached());
    const anyOrphan = AnyValue.seizeOrphan(trivialOrphan);
    t.false(trivialOrphan.isDetached());
    t.true(anyOrphan.isDetached());
    trivialOrphan = anyOrphan.move(builder.Trivial);
    t.true(trivialOrphan.isDetached());
    t.false(anyOrphan.isDetached());
    sg.adoptSg1(trivialOrphan);
    t.false(trivialOrphan.isDetached());
  }

  trivialOrphan = sg.disownSg1();
  t.not(trivialOrphan, null);
  if (trivialOrphan !== null) {
    t.true(trivialOrphan.isDetached());
    const anyOrphan = AnyValue.seizeOrphan(trivialOrphan);
    t.throws(() => {
      anyOrphan.move(UInt8List);
    }, PointerTypeError);
  }
});

test("adopt list", t => {
  t.plan(4);

  const arena = Builder.fresh(32, new Unlimited());
  const object = arena.allocate(16);
  const p = {
    typeBits: 0x01,
    hi: (5<<3) | 0x02,
    object,
  };
  const orphan = new Orphan(UInt8List, arena, p);
  t.true(orphan.isDetached());
  orphan.guts.adopt(arena, root(arena));
  t.false(orphan.isDetached());
  t.deepEqual(arena.pointer(root(arena)), p);
  t.throws(() => {
    orphan.guts.adopt(arena, root(arena));
  }, AdoptNonorphanError);
});

test("move list", t => {
  t.plan(16);

  const arena = Builder.fresh(2048, new Unlimited());
  const SN = builder.FirstNongeneric.FirstGeneric.specialize(Text, ListValue).SecondNongeneric;
  const SG = SN.SecondGeneric.specialize(Text);
  const sg = arena.initRoot(SG);
  let textOrphan = arena.initText("An inoffensive string");

  t.true(textOrphan.isDetached());
  const listOrphan = ListValue.seizeOrphan(textOrphan);
  t.false(textOrphan.isDetached());
  t.true(listOrphan.isDetached());
  textOrphan = listOrphan.move(Text);
  t.true(textOrphan.isDetached());
  t.false(listOrphan.isDetached());
  sg.adoptSg1(textOrphan);
  t.false(textOrphan.isDetached());

  textOrphan = sg.disownSg1();
  t.not(textOrphan, null);
  if (textOrphan !== null) {
    t.true(textOrphan.isDetached());
    const anyOrphan = AnyValue.seizeOrphan(textOrphan);
    t.false(textOrphan.isDetached());
    t.true(anyOrphan.isDetached());
    textOrphan = anyOrphan.move(Text);
    t.true(textOrphan.isDetached());
    t.false(anyOrphan.isDetached());
    sg.adoptSg1(textOrphan);
    t.false(textOrphan.isDetached());
  }

  textOrphan = sg.disownSg1();
  t.not(textOrphan, null);
  if (textOrphan !== null) {
    t.true(textOrphan.isDetached());
    const anyOrphan = AnyValue.seizeOrphan(textOrphan);
    t.throws(() => {
      anyOrphan.move(builder.Trivial);
    }, PointerTypeError);
  }
  //TODO: Test throws? Refine errors first?
});

/* TODO: implement a Capability wrapper. The RPC layer should drive its implementation, so no tests for now.
test("adopt capability", t => {
  t.plan(5);

  const arena = new Builder(32);
  const object = arena.allocate(0);
  const p = {
    typeBits: 0x03,
    hi: 0x12345678,
    object,
  };
  const orphan = new Orphan(arena, p);
  t.true(orphan.isDetached());
  orphan.guts.adopt(arena, root(arena));
  t.false(orphan.isDetached());
  const q = arena.pointer(root(arena));
  t.is(q.typeBits, 0x03);
  t.is(q.hi, 0x12345678);
  throwsAdoptNonorphan(orphan, t, arena);
});
*/
