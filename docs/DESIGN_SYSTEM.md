# Design System

## Visual Direction

The interface should feel like a premium conversion-rate-optimization and performance marketing planning dashboard. It should be clean, structured, practical, and client-ready.

The design should avoid a plain white page look by using layered surfaces, subtle borders, shadows, animated background texture, score cards, badges, and recommendation blocks.

## Colors

- Blue: analysis, primary actions, active focus, score progress
- Green: strong scores and low-risk status
- Yellow: medium risk and warning states
- Red: high risk and issue states
- Dark ink: readable body text and headings
- Soft gray: secondary text, borders, and dashboard surfaces

Color must not be the only indicator of status. Labels such as Strong, Needs improvement, Weak, Low risk, Medium risk, and High risk should always appear as text.

## Layout

- Use a hero section with the project name and dashboard preview.
- Use a three-step workflow: brief, traffic/offer inputs, generated report.
- Keep the form and generated report close together on desktop.
- Stack everything into a clean one-column layout on smaller screens.
- Keep the generated audit report structured like a client deliverable.

## Components

- Hero proof chips
- Dashboard preview card
- Input panel
- Report panel
- Score cards
- Risk badges
- Trust checklist cards
- Recommendation cards
- Data rows
- Callout blocks
- Export and reset buttons

Cards use restrained radius, borders, and shadows. They should look practical and dashboard-like rather than decorative.

## Spacing

- Use generous hero spacing on desktop.
- Use compact but readable spacing inside dashboard panels.
- Keep form controls visually grouped.
- Keep audit sections separated enough for scanning.

## Animation

Animation should be subtle, slow, and professional:

- Soft animated gradient movement
- Faint grid texture
- Slow chart-like line movement

Respect `prefers-reduced-motion` and keep all text readable over animated backgrounds.

## Responsive Rules

Breakpoints:

- `max-width: 1024px`
- `max-width: 768px`
- `max-width: 540px`

Responsive requirements:

- Use `box-sizing: border-box` globally.
- Keep containers at `max-width: 100%`.
- Avoid fixed widths that can break mobile.
- Prevent horizontal overflow.
- Stack form fields, score cards, audit cards, checklist blocks, and recommendation cards on mobile.
- Make buttons full-width or easy to tap on small screens.
- Keep text readable and inside its containers.

## Accessibility

- Use semantic HTML.
- Use labels for inputs.
- Use clear button text.
- Maintain readable color contrast.
- Add visible focus styles.
- Do not rely only on color for status.
- Keep the dashboard usable with a keyboard.
