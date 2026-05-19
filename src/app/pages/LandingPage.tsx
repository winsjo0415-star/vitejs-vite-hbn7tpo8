// Landing page with hero section and featured games

import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Gamepad2, Upload, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
          >
            <Gamepad2 className="h-20 w-20 text-blue-500" />
          </motion.div>

          {/* Tagline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent"
            >
              Your Chill Space for Browser Games
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Upload, organize, and play your HTML, JavaScript, and JSON games in a beautiful, modern interface. Built for creators and gamers alike.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/library">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Library
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/library">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full backdrop-blur-sm border-2 hover:bg-accent"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Game
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              icon: <Upload className="h-8 w-8" />,
              title: 'Easy Upload',
              description: 'Drag and drop your HTML, JS, and JSON files. Simple as that.',
              color: 'from-blue-500/20 to-blue-500/5'
            },
            {
              icon: <Gamepad2 className="h-8 w-8" />,
              title: 'Instant Play',
              description: 'Launch games directly in your browser with smooth transitions.',
              color: 'from-purple-500/20 to-purple-500/5'
            },
            {
              icon: <Sparkles className="h-8 w-8" />,
              title: 'Beautiful UI',
              description: 'Clean, modern design with dark mode and cozy aesthetics.',
              color: 'from-teal-500/20 to-teal-500/5'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`p-8 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-border/50 hover:border-border transition-all`}
            >
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-32 text-center"
        >
          <p className="text-muted-foreground mb-6">Ready to start your gaming journey?</p>
          <Link to="/library">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
