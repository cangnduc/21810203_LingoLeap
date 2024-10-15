# Test Page UI Design

## Overall Layout

The test page should have a clean, focused layout that minimizes distractions and adapts to various screen sizes. The page will consist of the following main sections:

1. Navigation Bar (simplified)
2. Test Information
3. Question Display
4. Answer Input Area
5. Test Progress
6. Timer
7. Submit Button

## Color Scheme and Typography

We'll use the same color scheme and typography as the home page for consistency:

- Primary Theme Color: Dark Blue (#1a237e)
- Secondary Theme Color: Bright Blue (#2196f3)
- White (#ffffff) for text on dark backgrounds
- Light Gray (#f5f5f5) for subtle backgrounds
- Dark Gray (#333333) for text on light backgrounds

Typography:

- Headings: Roboto Slab, serif
- Body Text: Open Sans, sans-serif

## Responsive Design

The layout should be fully responsive, with the following breakpoints:

- Mobile: Up to 767px
- Tablet: 768px to 1023px
- Desktop: 1024px and above

## Navigation Bar (Simplified)

- Fixed position at the top of the page
- Logo on the left side
- Test title in the center
- Exit button on the right (with confirmation dialog)
- Background color: Primary Theme Color (Dark Blue)
- Text color: White

## Test Information

- Test title
- Brief description or instructions
- Total number of questions
- Time limit

## Question Display

- Clear, large font for question text
- Support for various question types:
  - Multiple choice
  - Writing
  - Speaking (with audio recording interface)
  - Listening comprehension (with audio player)
- Image support for questions that require visual aids
- Question number clearly displayed

## Answer Input Area

- For multiple-choice: Radio buttons or checkboxes with labels
- For writing: Text area with character/word count
- For speaking: Audio recording interface with start/stop buttons
- For listening: Audio player with play/pause/seek controls

## Test Progress

- Progress bar showing current question number out of total
- Previous and Next buttons to navigate between questions
- Question palette:
  - Grid of question numbers
  - Color-coded to show answered, unanswered, and flagged questions
  - Clickable to jump to specific questions

## Timer

- Prominent display of remaining time
- Changes color when time is running low (e.g., last 5 minutes)
- Optional audio alert for low time

## Submit Button

- Large, clearly visible button
- Placed at the bottom of the page
- Confirmation dialog before final submission

## Additional Features

- Flag for review: Allow students to mark questions for later review
- Save and continue later: Option to save progress and resume the test later (if allowed by test settings)
- Accessibility features:
  - High contrast mode
  - Screen reader compatibility
  - Keyboard navigation support

## Responsive Considerations

- On smaller screens, question palette becomes a collapsible sidebar
- Ensure touch-friendly elements on mobile (e.g., larger buttons, spaced-out options)
- Adjust font sizes and spacing for readability on different devices

## Performance Optimization

- Lazy load images and audio files
- Implement efficient state management to handle question navigation without page reloads
- Use web workers for timer and auto-save functionality to prevent UI blocking

## Error Handling and Connectivity

- Implement auto-save functionality to prevent data loss
- Provide clear error messages for submission failures or connectivity issues
- Allow offline mode with synchronization when connection is restored

By following this design, the test page will provide a focused, user-friendly experience that allows students to concentrate on their exam while ensuring a smooth and reliable testing process across different devices and network conditions.
