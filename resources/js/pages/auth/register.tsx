import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Using a hero image from CDN instead of logo

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const colors = ['primary', 'red-500', 'fuchsia-500', 'blue-500', 'green-500', 'yellow-500', 'purple-500'];
    const bubbleVariants: any = {
        animate: (i: number) => ({
            y: [0, -600],
            scale: [0.5 + Math.random() * 0.5, 1 + Math.random() * 0.5, 0.5 + Math.random() * 0.5],
            opacity: [0, 0.3 + Math.random() * 0.2, 0],
            transition: {
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 2,
            },
        }),
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const childVariants: any = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const heroImage = 'https://pub-c5b607f049b640249ac60ba3c1dbee7b.r2.dev/play-or-pay-images/pexels-caique-araujo-101156227-13448523.jpg';

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen relative">
                {/* Mobile: full background image (blurred slightly, dark overlay and vignette) */}
                <div className="absolute inset-0 lg:hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImage})`, transform: 'scale(1.02)' }}
                    />
                    {/* dark overlay */}
                    <div className="absolute inset-0 bg-black/40" />
                    {/* subtle vignette */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.35)' }}
                    />
                </div>

                <div className="relative grid lg:grid-cols-2 min-h-screen">
                    {/* Desktop: left image panel (rounded, shadow, overlay, frosted border) */}
                    <div className="hidden lg:flex items-center justify-center p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full h-[560px] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${heroImage})` }}
                            />
                            {/* dark gradient overlay: darker toward the form side */}
                            <div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.0) 100%)' }}
                            />
                            {/* subtle frosted border */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-0 rounded-2xl border border-white/6 " />
                            </div>
                            {/* vignette */}
                            <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 140px rgba(0,0,0,0.25)' }} />
                        </motion.div>
                    </div>

                    {/* Form column */}
                    <div className="flex items-center justify-center p-6">
                        <div className="w-full max-w-md">
                            <div className="relative overflow-hidden rounded-xl bg-white lg:bg-card shadow-xl p-8">
                                <motion.form
                                    className="flex flex-col gap-8"
                                    onSubmit={submit}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                >
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid gap-6"
                                    >
                                        <motion.div variants={childVariants} className="grid gap-2">
                                            <Label htmlFor="name" className="text-sm font-medium text-foreground">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing}
                                                placeholder="Your full name"
                                                className="border-border focus:border-primary transition-all duration-300"
                                            />
                                            <InputError message={errors.name} className="mt-1 text-xs" />
                                        </motion.div>

                                        <motion.div variants={childVariants} className="grid gap-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                disabled={processing}
                                                placeholder="you@example.com"
                                                className="border-border focus:border-primary transition-all duration-300"
                                            />
                                            <InputError message={errors.email} className="mt-1 text-xs" />
                                        </motion.div>

                                        <motion.div variants={childVariants} className="grid gap-2">
                                            <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                disabled={processing}
                                                placeholder="Create a strong password"
                                                className="border-border focus:border-primary transition-all duration-300"
                                            />
                                            <InputError message={errors.password} className="mt-1 text-xs" />
                                        </motion.div>

                                        <motion.div variants={childVariants} className="grid gap-2">
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">Confirm password</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                disabled={processing}
                                                placeholder="Confirm your password"
                                                className="border-border focus:border-primary transition-all duration-300"
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                                        </motion.div>

                                        <motion.div variants={childVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button type="submit" className="w-full font-semibold transition-all duration-300 hover:shadow-md" tabIndex={5} disabled={processing}>
                                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                Create account
                                            </Button>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        variants={childVariants}
                                        className="text-muted-foreground text-center text-sm mt-4"
                                    >
                                        Already have an account?{' '}
                                        <TextLink href={route('login')} tabIndex={6} className="hover:underline transition-colors">
                                            Log in
                                        </TextLink>
                                    </motion.div>
                                </motion.form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}