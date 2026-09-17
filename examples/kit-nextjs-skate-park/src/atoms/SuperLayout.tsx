"use client";
import { useId } from "react";
import { z } from "zod";
import type { CSSProperties } from "react";

// TODO: poc - stand-in for the content editor's device settings (normally sourced from Layout Service).
const DEVICES = {
  Mobile: 370,
  Tablet: 768,
  Laptop: 1024,
  Desktop: 1440,
  Widescreen: 1920,
} as const;

type DeviceName = keyof typeof DEVICES;
const DEVICE_NAMES = Object.keys(DEVICES) as [DeviceName, ...DeviceName[]];

// TODO: poc - gap scale stands in for real Design System spacing tokens.
const GAP_VALUES = {
  none: "0",
  sm: "0.5rem",
  md: "1rem",
  lg: "2rem",
} as const;

// Strip characters that could break out of the generated CSS rule body.
const sanitizeCssValue = (value: string) => value.replace(/[{};]/g, "");
// Additionally strip characters that could break out of a url("...") function.
const sanitizeCssUrl = (value: string) =>
  sanitizeCssValue(value).replace(/[()'"]/g, "");

const backgroundSchema = z.object({
  color: z
    .string()
    .describe(
      'Background color (any valid CSS color, e.g. "#f4f4f5" or "rgba(0,0,0,0.5)").',
    )
    .optional(),
  image: z.string().describe("Background image URL.").optional(),
  position: z
    .string()
    .describe('CSS background-position value (e.g. "center", "top left").')
    .optional(),
  size: z
    .string()
    .describe(
      'CSS background-size value (e.g. "cover", "contain", "100px 50px").',
    )
    .optional(),
  repeat: z
    .string()
    .describe('CSS background-repeat value (e.g. "no-repeat", "repeat-x").')
    .optional(),
  attachment: z
    .string()
    .describe('CSS background-attachment value (e.g. "fixed", "scroll").')
    .optional(),
});

const borderSchema = z.object({
  width: z
    .string()
    .describe('CSS border-width value (e.g. "1px", "2px").')
    .optional(),
  style: z
    .enum([
      "solid",
      "dashed",
      "dotted",
      "double",
      "groove",
      "ridge",
      "inset",
      "outset",
      "none",
    ])
    .describe("CSS border-style.")
    .optional(),
  color: z
    .string()
    .describe("CSS border-color value (any valid CSS color).")
    .optional(),
  radius: z
    .string()
    .describe(
      'CSS border-radius value (e.g. "0.5rem", "9999px" for a pill/circle).',
    )
    .optional(),
});

const breakpointSchema = z.object({
  device: z
    .enum(DEVICE_NAMES)
    .describe(
      "Content editor device name at/above which this entry applies (see DEVICES: Mobile, Tablet, Laptop, Desktop, Widescreen). Omit for the base/default (mobile-first) styling.",
    )
    .optional(),
  columns: z
    .union([
      z.number().int().min(1).max(12),
      z.array(z.string()).min(1).max(12),
    ])
    .describe(
      'Number of items per row (row direction) or per column (column direction), each getting an equal share, OR an array of explicit widths (e.g. ["25%", "40%", "35%"]) for differently-sized columns. If the child count doesn\'t match, extra items wrap to additional rows/columns instead of overflowing.',
    )
    .optional(),
  direction: z
    .enum(["row", "column"])
    .describe(
      'Flex direction: "row" lays children out horizontally, "column" stacks them vertically.',
    )
    .optional(),
  wrap: z
    .enum(["nowrap", "wrap", "wrap-reverse"])
    .describe("Whether children wrap onto multiple lines when they don't fit.")
    .optional(),
  justify: z
    .enum([
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .describe(
      "Alignment of children along the main axis (CSS justify-content).",
    )
    .optional(),
  align: z
    .enum(["flex-start", "flex-end", "center", "stretch", "baseline"])
    .describe("Alignment of children along the cross axis (CSS align-items).")
    .optional(),
  gap: z
    .enum(["none", "sm", "md", "lg"])
    .describe("Spacing between children, from a fixed design-system scale.")
    .optional(),
  padding: z
    .string()
    .describe(
      'CSS padding value for the container (e.g. "1rem" or "8px 16px").',
    )
    .optional(),
  margin: z
    .string()
    .describe('CSS margin value for the container (e.g. "1rem" or "0 auto").')
    .optional(),
  width: z
    .string()
    .describe(
      'Explicit width for this container as a flex item (e.g. "50%", "300px"), useful when nesting it as a column inside a parent SuperLayout.',
    )
    .optional(),
  height: z
    .string()
    .describe(
      'Explicit height for this container as a flex item (e.g. "50%", "300px"), useful when nesting it as a row inside a parent SuperLayout.',
    )
    .optional(),
  background: backgroundSchema
    .describe(
      "Container background (color/image/position/size/repeat/attachment).",
    )
    .optional(),
  border: borderSchema
    .describe("Container border (width/style/color/radius).")
    .optional(),
  opacity: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "Container opacity from 0 (fully transparent) to 1 (fully opaque).",
    )
    .optional(),
});

type Breakpoint = z.infer<typeof breakpointSchema>;
type Background = z.infer<typeof backgroundSchema>;
type Border = z.infer<typeof borderSchema>;

export const superLayoutPropsSchema = z.object({
  breakpoints: z
    .array(breakpointSchema)
    .describe(
      "Responsive layout definitions. The entry without `device` is the base/default (mobile-first) styling; entries with `device` override a subset of these props at/above that device's width. Only specify the props that change at each breakpoint — list narrower devices before wider ones so the later, larger `min-width` rule wins on overlap as the viewport grows.",
    )
    .optional(),
});

export type SuperLayoutProps = z.infer<typeof superLayoutPropsSchema>;

export const superLayoutCatalogEntry = {
  props: superLayoutPropsSchema,
  description:
    "Standard component layout container: a tokenised flex wrapper (fixed column count per row) configured entirely via `breakpoints`, matched to content editor device widths. Can nest other SuperLayout instances as rows/columns for complex layouts. Use the `EmptyItem` atom as a child to represent an unfilled column/row slot with a droppable chrome placeholder; it gets replaced once a real atom is dropped into that slot.",
  slots: ["default"],
};

const buildBackgroundDeclarations = (background: Background): string[] => {
  const decls: string[] = [];
  if (background.color)
    decls.push(`background-color: ${sanitizeCssValue(background.color)}`);
  if (background.image) {
    decls.push(`background-image: url("${sanitizeCssUrl(background.image)}")`);
  }
  if (background.position) {
    decls.push(`background-position: ${sanitizeCssValue(background.position)}`);
  }
  if (background.size)
    decls.push(`background-size: ${sanitizeCssValue(background.size)}`);
  if (background.repeat)
    decls.push(`background-repeat: ${sanitizeCssValue(background.repeat)}`);
  if (background.attachment) {
    decls.push(
      `background-attachment: ${sanitizeCssValue(background.attachment)}`,
    );
  }
  return decls;
};

const buildBorderDeclarations = (border: Border): string[] => {
  const decls: string[] = [];
  if (border.width)
    decls.push(`border-width: ${sanitizeCssValue(border.width)}`);
  if (border.style) decls.push(`border-style: ${border.style}`);
  if (border.color)
    decls.push(`border-color: ${sanitizeCssValue(border.color)}`);
  if (border.radius)
    decls.push(`border-radius: ${sanitizeCssValue(border.radius)}`);
  return decls;
};

// Container-level (`.scopeClass`) declarations for one breakpoint entry.
const buildContainerDeclarations = (
  overrides: Omit<Breakpoint, "device" | "columns">,
): string => {
  const decls: string[] = [];

  if (overrides.direction) decls.push(`flex-direction: ${overrides.direction}`);
  if (overrides.wrap) decls.push(`flex-wrap: ${overrides.wrap}`);
  if (overrides.justify) decls.push(`justify-content: ${overrides.justify}`);
  if (overrides.align) decls.push(`align-items: ${overrides.align}`);
  if (overrides.gap) decls.push(`gap: ${GAP_VALUES[overrides.gap]}`);
  if (overrides.padding)
    decls.push(`padding: ${sanitizeCssValue(overrides.padding)}`);
  if (overrides.margin)
    decls.push(`margin: ${sanitizeCssValue(overrides.margin)}`);
  if (overrides.width)
    decls.push(`width: ${sanitizeCssValue(overrides.width)}`);
  if (overrides.height)
    decls.push(`height: ${sanitizeCssValue(overrides.height)}`);
  if (overrides.opacity !== undefined)
    decls.push(`opacity: ${overrides.opacity}`);
  if (overrides.background)
    decls.push(...buildBackgroundDeclarations(overrides.background));
  if (overrides.border)
    decls.push(...buildBorderDeclarations(overrides.border));

  return decls.map((decl) => `${decl} !important;`).join(" ");
};

// Direct-children declarations giving each child a share of the main axis (gap-adjusted so N
// items + gaps still sum to 100%). Percentage widths use `:nth-child(N of :not(code.scpm))`
// instead of plain `:nth-child(N)`, since editing chrome inserts invisible marker nodes as
// siblings that would otherwise shift the index.
const buildColumnsRules = (
  scopeClass: string,
  columns: number | string[],
  direction: "row" | "column",
  gapValue: string,
): string[] => {
  const declarationsFor = (basis: string): string =>
    direction === "column"
      ? `flex: 0 0 ${basis} !important; max-height: ${basis} !important; width: 100% !important;`
      : `flex: 0 0 ${basis} !important; max-width: ${basis} !important; height: 100% !important;`;

  if (typeof columns === "number") {
    const basis = `calc((100% - ${columns - 1} * ${gapValue}) / ${columns})`;
    return [`.${scopeClass} > * { ${declarationsFor(basis)} }`];
  }

  const count = columns.length;
  const gapDeduction =
    count > 1 ? `(${(count - 1) / count} * ${gapValue})` : "0";
  return columns.map((rawWidth, index) => {
    const cleanWidth = sanitizeCssValue(rawWidth).trim();
    const basis = cleanWidth.endsWith("%")
      ? `calc(${cleanWidth} - ${gapDeduction})`
      : cleanWidth;
    return `.${scopeClass} > *:nth-child(${index + 1} of :not(code.scpm)) { ${declarationsFor(
      basis,
    )} }`;
  });
};

// Base (mobile-first default) styles as inline CSS — keeps the atom self-contained, no build step.
const backgroundToStyle = (background?: Background): CSSProperties => ({
  backgroundColor: background?.color,
  backgroundImage: background?.image ? `url("${background.image}")` : undefined,
  backgroundPosition: background?.position,
  backgroundSize: background?.size,
  backgroundRepeat: background?.repeat as CSSProperties["backgroundRepeat"],
  backgroundAttachment:
    background?.attachment as CSSProperties["backgroundAttachment"],
});

const borderToStyle = (border?: Border): CSSProperties => ({
  borderWidth: border?.width,
  borderStyle: border?.style,
  borderColor: border?.color,
  borderRadius: border?.radius,
});

const buildBaseStyle = (base: Breakpoint): CSSProperties => {
  const {
    direction = "row",
    wrap = "wrap",
    justify,
    align,
    gap,
    padding,
    margin,
    width,
    height,
  } = base;

  return {
    display: "flex",
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent: justify,
    alignItems: align,
    gap: gap ? GAP_VALUES[gap] : undefined,
    padding,
    margin,
    width,
    height,
    opacity: base.opacity,
    ...backgroundToStyle(base.background),
    ...borderToStyle(base.border),
  };
};

export const SuperLayout = ({
  props,
  children,
}: {
  props: SuperLayoutProps;
  children?: React.ReactNode;
}) => {
  const { breakpoints = [] } = props;
  const scopeClass = `sc-super-layout-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  const base = breakpoints.find((bp) => bp.device === undefined) ?? {};
  const { columns, direction = "row", gap } = base;
  const style = buildBaseStyle(base);

  const rules: string[] = [];
  if (columns) {
    rules.push(
      ...buildColumnsRules(
        scopeClass,
        columns,
        direction,
        gap ? GAP_VALUES[gap] : "0",
      ),
    );
  }
  breakpoints
    .filter(
      (bp): bp is Breakpoint & { device: DeviceName } =>
        bp.device !== undefined,
    )
    .forEach(({ device, columns: bpColumns, ...overrides }) => {
      const minWidth = DEVICES[device];
      const parts: string[] = [];
      const containerDecls = buildContainerDeclarations(overrides);
      if (containerDecls) {
        parts.push(`.${scopeClass} { ${containerDecls} }`);
      }
      if (bpColumns) {
        const effectiveGap = overrides.gap ?? gap;
        parts.push(
          ...buildColumnsRules(
            scopeClass,
            bpColumns,
            overrides.direction ?? direction,
            effectiveGap ? GAP_VALUES[effectiveGap] : "0",
          ),
        );
      }
      if (parts.length) {
        rules.push(`@media (min-width: ${minWidth}px) { ${parts.join(" ")} }`);
      }
    });
  const responsiveCss = rules.join("\n");

  return (
    <>
      {responsiveCss ? <style>{responsiveCss}</style> : null}
      <div className={["sc-super-layout", scopeClass].join(" ")} style={style}>
        {children}
      </div>
    </>
  );
};
