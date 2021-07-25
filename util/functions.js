module.exports = {
    formatDate(d) {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        
        const days = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ];
        
        const year = d.getFullYear();
        const month = months[d.getMonth()];
        const day = days[d.getDay()];
        const date = d.getDate();
        const hours = ('0' + d.getHours()).slice('-2');
        const minutes = ('0'+ d.getMinutes()).slice('-2');
        const seconds = ('0' + d.getSeconds()).slice('-2');
        
        return `${day}, ${date} ${month} ${year} at ${hours}:${minutes}:${seconds}`
    }
}