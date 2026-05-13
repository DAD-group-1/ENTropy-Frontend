# Development Guidelines

## App structure :

- app (root folder of project source files)
  - constants (for constants)
  - core (core components)
    - data-service (for fetching data. We'll use a generator : https://openapi-generator.tech/)
    - interceptors (data interceptors)
    - models (for dtos)
    - services (business related logic)
    - utils (utils functions used across the app)
  - page-modules (different pages of the app that will be further divided in subfolders)
  - pipes (for angular pipes)
  - shared-modules (components used in multiple pages)
    - app-common (components used in multiple pages that have business logic)
    - layout (layout components e.g. header/footer)
    - ui-common (components that are used only for ui)
  - styles (stylesheets)

## Git
- Git branches must start with bugfix/, feature/, or fix/.
- Branch names use lowercase letters.
- Hyphens separate words in branch names.
- Use descriptive names for branches, e.g. feature/user-authentication.
- Commit messages should use imperative mood and be easy to understand

## Code Style
- Avoid more than 4 Tailwind utility classes on one element.
- Move styles to a CSS file using @apply when reaching this limit.
- Group related utility classes together.

## Best Practices
- Assign descriptive names to variables.
- Put a TODO comment with a clear description when leaving incomplete code.
- Remove all console logs before merging code.
- Comments should explain the reason for logic rather than the action.
- Check for accessibility tags on all interactive elements.
