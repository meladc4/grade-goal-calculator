# Grade Goal Calculator

Build a clean, modern, mobile-first web app called C4TOOLS.



Creator & Ownership



C4TOOLS is created and founded by Melad.



Display this attribution clearly but subtly in the website footer:



© 2026 C4TOOLS — Created by Melad



You may also use:



C4TOOLS — Founded & Created by Melad



Do not imply that C4TOOLS was created by an AI, Lovable, or any third party. Melad is the creator and founder of the project.



Core Purpose



C4TOOLS v1.0 is ONLY a Grade Calculator for students.



Do NOT add:



- AI features

- Login/signup

- PDF tools

- Physics tools

- Math tools

- Study timers

- Dashboards

- Payments

- Extra calculators

- Unnecessary pages



Keep the entire product focused on one excellent Grade Calculator.



Calculator



The user enters:



1. Current Grade (%)

2. Final Exam Weight (%)

3. Desired Final Grade (%)



Calculate the required final exam grade using:



Required Exam Grade =

(Target Grade - Current Grade × (1 - Exam Weight)) / Exam Weight



Where Exam Weight is converted from a percentage to a decimal.



Example:



Current Grade: 87%

Final Exam Weight: 30%

Desired Final Grade: 90%



Result:



You need 97% on your final exam.



Validation



- Current Grade must be between 0 and 100.

- Desired Final Grade must be between 0 and 100.

- Exam Weight must be greater than 0 and at most 100.

- Prevent invalid/non-numeric input.

- Show clear validation messages.



Handle special cases:



If the required grade is ≤ 0:

"You've already reached your target."



If the required grade is > 100:

"This target isn't mathematically possible with this exam."



Otherwise:

"You need X% on your final exam."



Round the displayed result to one decimal place when necessary.



Design



Make the design:



- Modern

- Minimal

- Professional

- Student-friendly

- Mobile-first

- Fast

- Easy to understand



The calculator should be the main focus of the page.



Use a clean card-based layout with large, easy-to-tap input fields.



The result should become visually prominent after calculation.



Include a simple header:



C4TOOLS



Under it:



Grade Calculator



Add a short subtitle:



"Find out exactly what you need on your final exam."



Do not clutter the interface.



Footer



Add a simple, professional footer at the bottom of the page:



© 2026 C4TOOLS — Created by Melad



Do not make the footer visually dominant. It should be noticeable but subtle.



Responsive Design



The website must work extremely well on:



- Android phones

- iPhones

- Tablets

- Desktop computers



Pay special attention to touch targets, font sizes, spacing, and keyboard-friendly inputs.



Technical Requirements



Build it as a production-ready web application.



Use clean, maintainable components.



Make the calculator work entirely client-side.



No backend is required for v1.0.



Do not add unnecessary dependencies.



Optimize for fast loading.



Make sure all calculations are mathematically accurate.



Before finishing, test multiple examples and edge cases to ensure the calculator produces correct results.



Important Scope Rule



This is C4TOOLS v1.0.



Do not expand the project beyond the Grade Calculator.



Do not invent additional features, pages, tools, or services.



The goal is to make this single calculator extremely polished, reliable, and easy to use.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1516cd53-006e-458f-bd95-59e88d7ee2f2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
