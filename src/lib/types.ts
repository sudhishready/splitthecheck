export interface Person {
  id: string
  name: string
}

export interface Item {
  id: string
  name: string
  price: number
  peopleIds: string[]
}