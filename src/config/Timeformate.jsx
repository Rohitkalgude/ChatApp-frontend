

function Timeformate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([],
        {
            hour: "2-digit", minute: "2-digit", hour12: true
        });
}

export default Timeformate;