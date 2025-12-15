import React from "react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, ArrowRight, Shield, Star, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MediCare</span>
          </div>
          <Button onClick={() => navigate('/auth')} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-medical-light-blue/50 to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Your Trusted Online Medical Store
{' '}
              <span className="text-primary">with Confidence</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
             Order medicines, healthcare products, and wellness essentials online with fast delivery and trusted brands.

            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
                Shop Medicines

                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose MedCompare?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-card p-8 shadow-sm border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Trusted Information
              </h3>
              <p className="text-muted-foreground">
                All product data is verified and sourced from reputable manufacturers and health organizations.
              </p>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-sm border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                User Reviews
              </h3>
              <p className="text-muted-foreground">
                Read authentic reviews from real customers to help make your purchasing decisions.
              </p>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-sm border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Easy Comparison
              </h3>
              <p className="text-muted-foreground">
                Compare up to 4 products side by side with detailed specifications and pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl gradient-primary p-12">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of users making informed health decisions every day.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 MediCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
