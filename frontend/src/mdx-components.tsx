import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
    ul: ({ children }) => <ul className="ml-8 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="ml-8 space-y-2">{children}</ol>,
    p: ({ children }) => <p className="text-base">{children}</p>,
    a: ({ children, href }) => (
      <a href={href} className="text-blue-500">
        {children}
      </a>
    ),
  };
}
