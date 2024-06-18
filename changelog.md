# Changelog

## Release 1.1 [unreleased]
Brief summary of what's in this release:

- Added icons to the attchment modal for admins/users to edit uploaded packages


### Breaking changes

Breaking changes include any database updates needed, if we need to edit any files on system (like .env or certs, etc). Things that are outside of the code itself that need changed for the system to work.

- Need to update the dynamicForms to version 10 from qa to handle site field correctly

### Non-breaking changes

Just a place to keep track of things that have changed in the code that we may want to pay special attention to when smoke testing, etc.

Added "constrains" property to fields that are used in a "constrainedBy" so that we can reset the constrained field when it changes. This ensures that we don't have an improper value in the constrained field.
