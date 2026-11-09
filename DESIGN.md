---
name: Dences Computers & Mobile
description: A monochrome, responsive electronics storefront adapted from the approved ecommerce kit.
colors:
  paper: "#fff"
  ink: "#1a1a1a"
  muted: "#626262"
  line: "#e6e6e6"
  surface: "#f5f5f5"
  surface-deep: "#ededed"
  green: "#286144"
  primary-hover: "#383838"
  secondary-border: "#d8d8d8"
  field-border: "#dcdcdc"
  saved: "#8f3232"
  required: "#8b3434"
typography:
  display:
    fontFamily: '"General Sans", Arial, sans-serif'
    fontSize: "clamp(36px, 4.15vw, 60px)"
    fontWeight: 600
    lineHeight: 1.09
    letterSpacing: "-0.045em"
  headline:
    fontFamily: '"General Sans", Arial, sans-serif'
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"General Sans", Arial, sans-serif'
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.02em"
  body:
    fontFamily: '"General Sans", Arial, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"General Sans", Arial, sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  radius: "12px"
  button: "9px"
  field: "8px"
  product-image: "11px"
  condition: "5px"
spacing:
  button: "15px 21px"
  field: "13px 14px"
  collection-gap: "26px"
  summary: "26px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "{spacing.button}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "{spacing.button}"
  request-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "{spacing.field}"
  collection-chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "9px 19px"
  collection-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  product-card:
    textColor: "{colors.ink}"
  product-image:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.product-image}"
  main-navigation:
    textColor: "{colors.ink}"
    height: "53px"
  order-summary:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.radius}"
    padding: "{spacing.summary}"
---

# Design System: Dences Computers & Mobile

## Overview

**Creative North Star: "Dences monochrome electronics storefront"**

The user-supplied angular white-on-black Dences logo anchors the approved monochrome ecommerce kit's adaptation to electronics. White pages, black actions, quiet grey image wells and contained product photography give devices and prices the strongest visual presence. Desktop layouts extend the mobile kit into a spacious customer storefront.

The implemented system uses handcrafted CSS, local General Sans fonts, Lucide line icons and restrained Motion interactions. Shared customer components belong to this identity; the later protected ERP has no implemented visual system yet. This record describes the shipped frontend, without adding a new visual direction.

**Key Characteristics:**

- Monochrome surfaces and high-contrast primary actions.
- Contained device imagery and compact product information.
- Gently rounded controls, flat surfaces and fine dividers.
- Responsive shopping layouts with restrained, reduced-motion-aware interactions.

## Colors

The palette is neutral and product-led, with small semantic color exceptions.

### Primary

- **Ink** (`ink`): primary actions, headings, selected filters, active navigation and focus outlines.
- **Primary hover** (`primary-hover`): a lighter charcoal for primary action hover.

### Neutral

- **Paper** (`paper`): page, fields, secondary buttons and floating controls.
- **Muted** (`muted`): supporting copy, specifications and metadata.
- **Line** (`line`): navigation dividers, filter strokes and list separators.
- **Surface** (`surface`): product image wells, search and summary panels.
- **Surface deep** (`surface-deep`): compact count backgrounds and subdued layers.
- **Secondary border** (`secondary-border`) and **Field border** (`field-border`): quiet boundaries around white controls.

Green marks the locally generated request-preview success icon; saved red marks a selected heart; required red marks required-field indicators. These are semantic exceptions, not additional brand accents. Product imagery can retain its native color.

**The Monochrome Action Rule.** Use ink and paper for primary actions and selection; reserve semantic colors for their implemented meanings.

## Typography

**Display Font:** General Sans, with Arial and sans-serif fallback.
**Body Font:** General Sans, with the same fallback.

Local files provide regular, medium, semibold and bold weights (400, 500, 600, 700). The system pairs tight semibold headings with regular supporting copy and medium controls. There is no separate display or mono family and no mathematical type scale.

### Hierarchy

- **Display:** the frontmatter role describes the desktop hero; intermediate screens use a fixed (44px) title, mobile uses (39px) and the narrowest breakpoint uses (35px). Mobile line height is (1.08).
- **Headline:** the frontmatter role describes collection headings; these become (24px) on mobile and (22px) at the narrowest breakpoint. Page and product-detail headings use their own larger sizes.
- **Title:** product names use the frontmatter role on desktop, then (14px) at the intermediate breakpoint and (13px) on mobile, with mobile line height (1.4).
- **Body:** the frontmatter role is the base body. Explanatory sections commonly use (13–16px); metadata is deliberately smaller and must be checked at the actual layout density.
- **Label:** the frontmatter role describes desktop buttons. Navigation uses (13px/500); request labels use (12px/500). Controls use sentence case. Brand lettering is the established uppercase exception.

**The Readable Metadata Rule.** Preserve the final stylesheet's legibility overrides: product metadata uses (11px) desktop, (10px) mobile and (9px) on the narrowest screens; product summaries use (12px) desktop and (11px) mobile. Earlier declarations are superseded.

## Layout

The centered page container is capped by the CSS page token (1280px), with total horizontal clearance (96px) by default, (64px) at the intermediate breakpoint, (40px) on mobile and (30px) on the narrowest screens. Content density changes at max-width breakpoints (1100px), (767px) and (370px), with a wide-screen adjustment at min-width (1600px); these are the actual CSS thresholds, not a framework breakpoint scale.

Home collections use four equal columns on desktop and two on mobile. Catalogue results use three columns beside a (200px) filter sidebar, then two beside a narrower sidebar at the intermediate breakpoint. On mobile, filtering becomes a toggleable panel and horizontally scrollable category controls. Product detail, cart and request forms collapse to one column. Request summaries precede fields on mobile.

Spacing is component-specific, with recurring gaps around (8–12px), (18–26px) and larger section separations. There is no installed spacing utility scale. The desktop summary width is (355px), reduced to (310px) at the intermediate breakpoint; mobile summaries are static and full width.

The mobile bottom navigation is fixed with a (67px) bar and safe-area padding; the body reserves (68px). Toasts move above it. Do not let primary actions or content fall behind this navigation.

## Elevation & Depth

Surfaces are flat at rest. Grey image wells, white controls and fine dividers establish hierarchy. Product-card hover adds a small spring lift (3px) and image scale (1.055), rather than a card shadow. The mobile menu uses a diffuse shadow (`0 12px 20px #0001`); toast feedback uses the separate shadow recorded in the sidecar. These are overlay exceptions, not a shadow treatment for ordinary cards.

**The Flat Surface Rule.** Use tonal separation and dividers for resting product cards and panels; retain shadows for implemented floating feedback and menus.

## Shapes

The shared panel radius comes from `rounded.radius`. Product wells, controls and badges use the smaller radii in the frontmatter. The supplied angular logo remains intact inside its black, rounded brand tile; rounded UI does not imply redrawing the logo. Count indicators and small round actions use circular geometry. Borders are generally a single pixel; there is no thick outlined or hard-offset shadow language.

## Components

### Buttons

Confident, compact actions: the primary is ink on paper's inverse, while secondary is a white control with a light border. Shared padding, shape and typography are in the frontmatter; minimum desktop height is (51px). Primary hover uses its dedicated charcoal, secondary hover uses surface grey, and press scales the control to (0.97). Arrow icons shift right (3px). Disabled buttons reduce opacity to (0.4) and use a not-allowed cursor.

### Chips

Collection filters use a light border, medium text and compact rounded shape. Hover introduces surface grey; selected chips invert to ink and paper. Mobile chips remain on a horizontally scrollable row. Preserve the actual selection semantics in the component rather than relying on color alone.

### Cards / Containers

Product cards use a flat outer article, a grey contained-image well, a condition badge, an independently named save control, title/specification copy and a price/add row. Images use `object-fit: contain` and multiply blending to meet the grey well. New/pre-owned badges describe actual sample data. Price figures use tabular numerals. No decorative color swatch is part of this system; product color is text metadata.

Cards lift with a spring (stiffness 380, damping 28); reduced-motion users receive no card lift. Desktop quick-view appears on hover and keyboard focus within; mobile hides it while the image and title remain links. The add control is an outlined square that inverts on hover. Saved hearts have pressed state and an accessible name.

Summary panels use the common surface and panel radius, with a fine total divider. They are sticky on desktop and static on mobile.

### Inputs / Fields

Request fields are white, lightly outlined and gently rounded. Their padding and radius are in the frontmatter. The global focus-visible ring is (2px) ink with offset (5px); request inputs reduce that offset to (1px). Textareas resize vertically. Mobile request fields use (16px) type. Required markers are red, supported by labels and native validation; no custom error-message visual system has been implemented.

Search is a distinct surface-grey field with a line icon and an accessible label. Radio, checkbox and range accents use ink. Receipt selection previews a local file and must retain its visible local-only explanation.

### Navigation

Desktop navigation uses medium compact text and a thin ink underline for hover/current state. The current desktop item is query-aware for category and pre-owned links and exposes `aria-current="page"`. Mobile replaces the desktop row with a menu/search panel and a fixed icon-and-label bottom bar. Counts and saved state remain visible without implying server-backed inventory. Lucide icons are line SVGs; icon-only actions have descriptive accessible names.

### Motion and Feedback

CSS state changes commonly take (0.2s); transforms use (0.3s) with the shared ease curve, while product image scaling uses (0.5s). Motion handles card springs and menu/toast presence. Respect the implemented global reduced-motion preference, including smooth-scroll removal; do not introduce continuous decorative animation.

Toasts confirm local cart/saved interactions. Request success confirms a generated preview, with download and print actions; it does not confirm a submitted order or payment.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied Dences logo and the approved monochrome kit adaptation.
- **Do** reuse the existing CSS tokens and shared customer components before introducing variants.
- **Do** retain keyboard focus, accessible icon labels, state semantics and reduced-motion support.
- **Do** label sample products and prices and keep local-preview notices beside relevant actions.
- **Do** use contained product imagery and test text at both catalogue densities.

### Don't:

- **Don't** introduce a new accent palette, display font or decorative shadow language without an approved identity change.
- **Don't** replace actual code values with framework defaults or an aspirational component-library stack.
- **Don't** imply live stock, a sent request, an uploaded receipt, verified payment or a payment gateway in the preview.
- **Don't** extend customer storefront rules into an invented ERP interface.

## Repository location

This file remains the canonical shared design reference. Implemented components, styles, fonts and images now live under frontend/src/ and frontend/public/. frontend/DESIGN.md points here; the folder reorganization does not change the approved visual direction.
