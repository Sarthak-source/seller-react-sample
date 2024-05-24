export function useUserTableFormat() {

    const userHeaderRow = [
        { id: 'name', label: 'Seller name' },
       
        { id: 'phoneNumber', label: 'Phone number' },
        
        { id: 'status', label: 'Status' },
        { id: '' },
    ]

    return {
        userHeaderRow,
    
    };
}
