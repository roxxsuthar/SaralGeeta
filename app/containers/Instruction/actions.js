/*
 *
 * Instruction actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_INSTRUCTION,
  GET_INSTRUCTION_SUCCESS,
  GET_INSTRUCTION_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getInstruction(policyType) {
  return {
    type: GET_INSTRUCTION,
    policyType,
  };
}

export function getInstructionSuccess(payload) {
  return {
    type: GET_INSTRUCTION_SUCCESS,
    payload,
  };
}

export function getInstructionFail() {
  return {
    type: GET_INSTRUCTION_FAIL,
  };
}
