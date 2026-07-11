"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/cardboard/input-otp";
import { ComponentPage, Demo } from "../_component-page";

export default function InputOTPDocs() {
  return (
    <ComponentPage
      title="Input OTP"
      description="A one-time-passcode field — individual character slots with an animated caret. The active slot uses the focus-ring token; invalid uses critical."
    >
      <Demo title="Six digits">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Demo>

      <Demo title="Four digits, joined">
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Demo>
    </ComponentPage>
  );
}
