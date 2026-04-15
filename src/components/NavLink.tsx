// 1. IMPORTS
// We import the real 'NavLink' from react-router-dom, but give it an alias (RouterNavLink)
// so it doesn't clash with the name of OUR custom component we're building below!
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
// forwardRef allows a custom component to receive a physical HTML reference from its parent
import { forwardRef } from "react";
// utility to merge tailwind classes together neatly
import { cn } from "@/lib/utils";

// 2. INTERFACES
// We are extending the default Router properties but overwriting/adding our own custom CSS class handlers!
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string; // Standard default class
  activeClassName?: string; // Class applied ONLY if the current page matches the link (e.g. underline it)
  pendingClassName?: string; // Class applied when routing is still loading
}

// 3. MAIN COMPONENT (ADVANCED)
// This is a Wrapper Component. We don't want to use standard <NavLink> across our app because it doesn't natively
// support splitting 'activeClassName' easily. So we wrap it, add our magic, and export our custom version.
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      // We render the REAL react router dom link...
      <RouterNavLink
        ref={ref}
        to={to}
        // ...but we intercept its native 'className' prop, which natively accepts a function!
        // It provides 'isActive' (boolean true if the URL matches) and 'isPending'
        className={({ isActive, isPending }) =>
          // We use our 'cn' merging tool to stitch together the base class, and optionally the active class
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        // Pass any remaining wildcard props (like onClick, target="_blank", etc) straight through
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink"; // Better error reporting in React DevTools

export { NavLink };
