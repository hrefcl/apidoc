<a name="top"></a>
# <%= project.name %> v<%= project.version %>

<%= project.description %>
<% if (header) { -%>

<%- header %>
<% } -%>

# Table of contents

<% data.forEach(group => { -%>
- [<%= group.name %>](#<%= toLink(group.name) -%>)
<% group.subs.forEach(sub => { -%>
  - [<%= sub.title %>](#<%= toLink(sub.title) %>)
<% })}) -%>

___

<% if (prepend) { -%>
<%- prepend %>
<% } -%>
<% data.forEach(group => { -%>

# <a name='<%= toLink(group.name) %>'></a> <%= group.name %>
<% group.subs.forEach(sub => { -%>

## <a name='<%= toLink(sub.title) %>'></a> <%= sub.title %>
[Back to top](#top)

<%- sub.description ? `${cleanDescription(sub.description)}\n\n` : '' -%>
<% if (sub.type && sub.url) { -%>
```
<%- sub.type.toUpperCase() %> <%= sub.url %>
```
<% } else if (sub.type === 'mqtt') { -%>
```
MQTT <%= sub.mqttType ? sub.mqttType.toUpperCase() : 'PUBLISH' %> <%= sub.topic || sub.url %>
```
<% } -%>
<% if (sub.header && sub.header.fields) { -%>
<% Object.entries(sub.header.fields).forEach(([headersGroup, headersGroupContent]) => { -%>

### Headers - `<%= headersGroup %>`

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
<% headersGroupContent.forEach(header => { -%>
| <%- header.field %> | <%- formatType(header.type) %> | <%- formatOptional(header.optional) %><%- cleanDescription(header.description) %> |
<% }) -%>
<% }) -%>
<% } -%>
<% if (sub.header && sub.header.examples && sub.header.examples.length) { -%>

### Header examples
<% sub.header.examples.forEach(example => { -%>

<%- example.title %>

```<%- example.type %>
<%- example.content %>
```
<% }) -%>
<% } -%>
<% if (sub.parameter && sub.parameter.fields) { -%>
<% Object.entries(sub.parameter.fields).forEach(([parametersGroup, parametersGroupContent]) => { -%>

### Parameters - `<%= parametersGroup %>`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
<% parametersGroupContent.forEach(param => { -%>
| <%- param.field %> | <%- formatType(param.type) %> | <%- formatOptional(param.optional) %><%- cleanDescription(param.description) %> |
<% }) -%>
<% }) -%>
<% } -%>
<% if (sub.parameter && sub.parameter.examples && sub.parameter.examples.length) { -%>

### Parameters examples
<% sub.parameter.examples.forEach(example => { -%>

<%- example.title %>

```<%- example.type %>
<%- example.content %>
```
<% }) -%>
<% } -%>
<% if (sub.examples && sub.examples.length) { -%>

### Examples
<% sub.examples.forEach(example => { -%>

<%- example.title %>

```<%- example.type %>
<%- example.content %>
```
<% }) -%>
<% } -%>
<% if (sub.success && sub.success.fields) { -%>
<% Object.entries(sub.success.fields).forEach(([successGroup, successGroupContent]) => { -%>

### Success response - `<%= successGroup %>`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
<% successGroupContent.forEach(param => { -%>
| <%- param.field %> | <%- formatType(param.type) %> | <%- formatOptional(param.optional) %><%- cleanDescription(param.description) %> |
<% }) -%>
<% }) -%>
<% } -%>
<% if (sub.success && sub.success.examples && sub.success.examples.length) { -%>

### Success response example
<% sub.success.examples.forEach(example => { -%>

<%- example.title %>

```<%- example.type %>
<%- example.content %>
```
<% }) -%>
<% } -%>
<% if (sub.error && sub.error.fields) { -%>
<% Object.entries(sub.error.fields).forEach(([errorGroup, errorGroupContent]) => { -%>

### Error response - `<%= errorGroup %>`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
<% errorGroupContent.forEach(param => { -%>
| <%- param.field %> | <%- formatType(param.type) %> | <%- formatOptional(param.optional) %><%- cleanDescription(param.description) %> |
<% }) -%>
<% }) -%>
<% } -%>
<% if (sub.error && sub.error.examples && sub.error.examples.length) { -%>

### Error response example
<% sub.error.examples.forEach(example => { -%>

<%- example.title %>

```<%- example.type %>
<%- example.content %>
```
<% }) -%>
<% } -%>
<% if (sub.filename) { -%>

### Source

<%- sub.filename %>:<%- sub.linenumber %>

<% } -%>
<% }) -%>
<% }) -%>
<% if (footer) { -%>

___

<%- footer %>
<% } -%>