# Deployment Documentation

## Project

CineSearch - Movie Search App

## Deployment Platform

GitHub Pages

## Deployment Method

The project is automatically deployed using GitHub Actions whenever changes are pushed to the `main` branch.

## Workflow

The deployment workflow is located at:

`.github/workflows/deploy.yml`

The workflow performs the following steps:

1. Checks out the repository.
2. Configures GitHub Pages.
3. Uploads the website files as a Pages artifact.
4. Deploys the artifact to GitHub Pages.

## Deployment Trigger

The workflow is triggered when code is pushed to the `main` branch.

It can also be triggered manually using GitHub Actions.

## Rollback Evidence

A rollback test was performed during the project.

The following commits demonstrate the rollback process:

1. `Test rollback change`
2. `Revert "Test rollback change"`

The GitHub Actions page shows successful workflow execution for both the test change and the subsequent revert.

## Verification

After deployment, the live application was tested for:

- Movie search
- Search results
- Movie details
- Loading state
- Error handling
- Responsive layout
- API integration

## Outcome

The CineSearch application was successfully deployed to GitHub Pages using GitHub Actions.