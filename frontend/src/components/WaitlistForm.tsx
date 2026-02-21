"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"brand" | "creator">("creator");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rank, setRank] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: dbError } = await supabase
                .from("waitlist")
                .insert([{ email, name, role }]);

            if (dbError) {
                if (dbError.code === "23505") {
                    throw new Error("You're already on the waitlist! We'll be in touch.");
                }
                throw dbError;
            }

            const { count, error: countError } = await supabase
                .from("waitlist")
                .select("*", { count: "exact", head: true });

            if (!countError && count !== null) {
                setRank(count);
            }

            setSuccess(true);
            setEmail("");
            setName("");
        } catch (err: any) {
            console.error("Waitlist error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center p-12"
                    >
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-heading font-semibold mb-3 text-foreground">We&apos;ve received your application.</h3>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="max-w-md mx-auto space-y-8 p-1 sm:p-0"
                    >
                        <div className="space-y-2 text-center mb-8">
                            <h3 className="text-3xl font-heading font-semibold text-foreground">Get in touch</h3>
                            <p className="text-foreground/50">Join the exclusive beta for brands and creators.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-white border border-black/10 rounded-xl px-4 h-12 focus:border-black/30 transition-colors placeholder:text-foreground/20 focus:ring-0 text-base text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="jane@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white border border-black/10 rounded-xl px-4 h-12 focus:border-black/30 transition-colors placeholder:text-foreground/20 focus:ring-0 text-base text-foreground"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1">I am a...</Label>
                                <RadioGroup
                                    defaultValue="creator"
                                    value={role}
                                    onValueChange={(val: any) => setRole(val)}
                                    className="flex gap-3"
                                >
                                    {["brand", "creator"].map((option) => {
                                        const isActive = role === option;
                                        return (
                                            <div key={option} className="flex items-center">
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`role-${option}`}
                                                    className="sr-only"
                                                />
                                                <Label
                                                    htmlFor={`role-${option}`}
                                                    onClick={() => setRole(option as any)}
                                                    className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-300 capitalize text-sm font-medium ${isActive
                                                        ? "bg-foreground text-white border-foreground"
                                                        : "border-black/10 bg-white hover:bg-gray-50 text-foreground/50"
                                                        }`}
                                                >
                                                    {option}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-foreground text-white rounded-full h-12 text-base font-semibold hover:scale-[1.02] transition-transform shadow-lg shadow-black/10 mt-8"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Join Waitlist"
                            )}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
