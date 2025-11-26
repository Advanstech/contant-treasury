import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { FooterLogo } from '@/components/brand/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FooterLogo />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ghana's premier digital platform for Treasury Bills, Bonds, and fixed-income securities.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Invest */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Invest</h3>
            <ul className="space-y-3">
              <li><Link href="/securities" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Securities</Link></li>
              <li><Link href="/securities/treasury-bills" className="text-sm text-muted-foreground hover:text-primary transition-colors">Treasury Bills</Link></li>
              <li><Link href="/securities/bonds" className="text-sm text-muted-foreground hover:text-primary transition-colors">Bonds</Link></li>
              <li><Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Portfolio</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">Investment Guides</Link></li>
              <li><Link href="/calculators" className="text-sm text-muted-foreground hover:text-primary transition-colors">Calculators</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; {currentYear} Constant Treasury. All rights reserved.</p>
              <span className="hidden md:inline">•</span>
              <p>
                Powered by <a href="https://constantcap.com.gh" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Constant Capital Ghana</a>
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground/70 text-center max-w-4xl mx-auto">
              Investment in securities involves risk. Past performance is not indicative of future results. 
              Please read all scheme-related documents carefully before investing. 
              Constant Treasury is a digital platform operated by Constant Capital Ghana, 
              licensed by the Securities and Exchange Commission (SEC) of Ghana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
