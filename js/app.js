Vue.component(
    'creature-listing',
    {
        props: [
            'creature'
        ],
        template: '<li>{{ creature.name }}</li>'
    }
);

var app = new Vue({
    el: '#app',
    data: {
        creatures: [],
        initiativeOrder: []
    },
    created: function () {
        // this runs when the component is mounted
        fetch("creatures.json")
            .then(data => data.json())
            .then(creatures => { this.creatures = creatures })
    }
});