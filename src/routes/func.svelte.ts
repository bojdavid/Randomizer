const data = [
    { id: 1, name: "Alice", selected: false },
    { id: 2, name: "Bob", selected: false },
    { id: 3, name: "Charlie", selected: false },
    { id: 4, name: "Diana", selected: false },
    { id: 5, name: "Ethan", selected: false },
    { id: 6, name: "Fiona", selected: false },
    { id: 7, name: "George", selected: false },
    { id: 8, name: "Hannah", selected: false },
    { id: 9, name: "Ian", selected: false },
    { id: 10, name: "Jasmine", selected: false },
    { id: 11, name: "Kyle", selected: false },
    { id: 12, name: "Luna", selected: false },
    { id: 13, name: "Mason", selected: false },
    { id: 14, name: "Nina", selected: false },
    { id: 15, name: "Oscar", selected: false },
    { id: 16, name: "Paula", selected: false },
    { id: 17, name: "Quinn", selected: false },
    { id: 18, name: "Ryan", selected: false },
    { id: 19, name: "Sophie", selected: false },
    { id: 20, name: "Tom", selected: false },

]

  // INTERFACE FOR PERSON OBJECT
  interface Person {
    id: number;
    name: string;
    selected: boolean;
    group?: string;
  }


export function downloadCSV(data: Record<string, any>[], filename: string = 'data.csv'): void {
    if (!data.length) {
      console.warn("No data provided");
      return;
    }
  
    // Extract headers from the keys of the first object
    const headers = Object.keys(data[0]);
  
    // Generate CSV string
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => headers.map(header => JSON.stringify(row[header], replacer)).join(','))
    ];
  
    const csvString = csvRows.join('\n');
  
    // Create a Blob and URL for the CSV
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    // Create and click a temporary download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Helper function to handle commas, quotes, and newlines within CSV fields
  function replacer(key: string, value: any): any {
    if (typeof value === 'string') {
      return value.replace(/"/g, '""');
    }
    return value;
  }


/*
export const downloadCSV = (peopleData: any) =>{
    console.log("Downloaded CSV file")
    console.log($state.snapshot(peopleData))
}
*/

export const getDistinctGroups = (data: Person[]): string[] => {
    const groups = new Set<string>();
  
    data.forEach(person => {
      if (person.group) {
        groups.add(person.group);
      }
    });
  
    return Array.from(groups);
  }

export const  assignNewDistinctGroup = (existingGroups: string[]): string => {
    let groupNumber = 1;
    let newGroup = `g${groupNumber}`;
  
    // Increment groupNumber until a distinct group name is found
    while (existingGroups.includes(newGroup)) {
      groupNumber += 1;
      newGroup = `G${groupNumber}`;
    }
  
    // Optionally, add the new group to existing groups to track it
    existingGroups.push(newGroup);
  
    return newGroup;
  }

export const resetSelection = (peopleData: Person[], group: string[]) =>{
    for(let i: number = 0; i < peopleData.length; i++){
        peopleData[i].selected = false
        peopleData[i].group = "No group"
    }
    group = ["No group"]
}