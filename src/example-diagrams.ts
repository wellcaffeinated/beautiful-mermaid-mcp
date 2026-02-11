const flowchart = `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Process]
  B -->|No| D[End]
  C --> D`

const stateDiagram = `stateDiagram-v2
  [*] --> Idle
  Idle --> Processing: start
  Processing --> Complete: done
  Complete --> [*]`

const sequenceDiagram = `sequenceDiagram
  Alice->>Bob: Hello Bob!
  Bob-->>Alice: Hi Alice!
  Alice->>Bob: How are you?
  Bob-->>Alice: Great, thanks!`

const classDiagram = `classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  Animal: +int age
  Animal: +String gender
  Animal: +isMammal() bool
  Duck: +String beakColor
  Duck: +swim()
  Duck: +quack()`

const erDiagram = `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  PRODUCT ||--o{ LINE_ITEM : "is in"`

export default [
  { name: 'flowchart', text: flowchart },
  { name: 'stateDiagram', text: stateDiagram },
  { name: 'sequenceDiagram', text: sequenceDiagram },
  { name: 'classDiagram', text: classDiagram },
  { name: 'erDiagram', text: erDiagram },
]
