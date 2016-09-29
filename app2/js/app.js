AquariumViewModel = function() {
    var self = this;
    self.aquariums = ko.observableArray();
    $.getJSON("http://localhost/ReefTrace/aquariums").
        then(function(aquariums.aquarium) {
            alert(JSON.stringify(aquariums.aquariums['0']));
            $.each(aquariums, function(i,v) {
                alert(JSON.stringify(v.aquarium);
                self.aquariums.push({
                    /*title: ko.observable(this.title),
                    Description: ko.observable(this.Description)*/
                    v.aquarium;
                });
            });
        });
};
$(function() {
    //alert("Funciona 8|");
    
    ko.applyBindings(new AquariumViewModel());
  });