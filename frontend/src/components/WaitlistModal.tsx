"use client";

import React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import WaitlistForm from "./WaitlistForm";

interface WaitlistModalProps {
    children: React.ReactNode;
}

export default function WaitlistModal({ children }: WaitlistModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-black/5 rounded-[2rem]">
                {/* 
                  Hidden title/description for accessibility. 
                  WaitlistForm handles the actual visual title.
                */}
                <DialogTitle className="sr-only">Claim Your Spot</DialogTitle>
                <DialogDescription className="sr-only">Early access to exclusive brand drops and campaigns.</DialogDescription>

                <div className="p-8 pt-10">
                    <WaitlistForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}
