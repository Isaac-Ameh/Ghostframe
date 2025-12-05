# 📊 GhostFrame Analytics Plugin

Track your GhostFrame module development activity and get insights into your workflow.

## Features

- 📈 Track builds, tests, validations, and publishes
- 📊 Per-module statistics
- 🕐 Activity timestamps
- 💾 Persistent storage

## Installation

```bash
gf plugin install ghostframe-plugin-analytics
```

## Usage

Once installed, the plugin automatically tracks:

- Module initializations
- Build operations
- Test runs
- Validation checks
- Module publishes

## Viewing Stats

Analytics are stored in `~/.ghostframe/analytics.json`:

```json
{
  "builds": 42,
  "tests": 156,
  "validations": 38,
  "publishes": 12,
  "modules": {
    "quiz-master": {
      "builds": 15,
      "tests": 45,
      "validations": 12,
      "publishes": 3,
      "created": "2024-01-15T10:30:00.000Z"
    }
  },
  "lastActivity": "2024-01-20T14:22:00.000Z"
}
```

## Hooks

This plugin implements the following hooks:

- `afterInit` - Track module creation
- `afterBuild` - Track builds
- `afterTest` - Track test runs
- `onValidate` - Track validations
- `afterPublish` - Track publishes

## Configuration

No configuration required - works out of the box!

## License

MIT
