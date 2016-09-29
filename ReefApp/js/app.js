function Aquarium(item) {
    this.nid = ko.observable(item.Nid);
    this.title = ko.observable(item.title);
    this.Description =ko.observable(item.Description);
    this.Shape =ko.observable(item.Shape);
    this.Type =ko.observable(item.Type);
    this.Metric = ko.observable(item.Metric);
    this.MainAquarium = ko.observable(item.MainAquarium);
    this.Sump = ko.observable(item.Sump);
    this.Refugium = ko.observable(item.Refugium);
    this.PropagationTank = ko.observable(item.PropagationTank);
    this.OtherVolume = ko.observable(item.OtherVolume);
    this.imgAquarium = ko.observable(item.imgAquarium.src);

}

function AquariumShape(item){
    this.name = item.name;
    this.idShape = item.idShape;
    
}

function AquariumType(item){
    this.name = item.name;
    this.idType = item.idType;
}

function AquariumMetric(item){
    this.name = item.name;
    this.idMetric = item.idMetric;
}


ko.observableArray.fn.find = function(prop, data) {
    var valueToMatch = data[prop];
    return ko.utils.arrayFirst(this(), function(item) {
        return item[prop] === valueToMatch; 
    });
};

ko.observableArray.fn.changeAquarium = function(prop, data, newData) {
    var valueToMatch = data[prop];
    return ko.utils.arrayFirst(this(), function(item) {
        if (item.nid()===valueToMatch) {
          item.title(newData.title);
          item.Description(newData.Description);
          item.Shape(newData.Shape);
          item.Type(newData.Type);
          item.Metric(newData.Metric);
          item.MainAquarium(newData.MainAquarium);
          item.Sump(newData.Sump);
          item.Refugium(newData.Refugium);
          item.PropagationTank(newData.PropagationTank);
          item.OtherVolume(newData.OtherVolume);
        };
        return item.nid() === valueToMatch; 
    });
};

AquariumViewModel = function() {
    var self = this;
    
    self.aquariums = ko.observableArray([]);
    self.types = ko.observableArray([]);
    self.aquariumsShapes = ko.observableArray([]);
    /*self.aquariumsMetrics = ["Liters","Galons"];*/
    self.aquariumsMetrics = ko.observableArray([]);
    
    self.nid = ko.observable();
    self.title = ko.observable();
    self.Description = ko.observable();
    self.Shape = ko.observable();
    self.Type = ko.observable();
    self.Metric = ko.observable();
    self.MainAquarium = ko.observable();
    self.Sump = ko.observable();
    self.Refugium = ko.observable();
    self.PropagationTank = ko.observable();
    self.OtherVolume = ko.observable();
    self.imgAquarium = ko.observable();
    

    //Observables fields
    self.selectedType = ko.observable("");
    self.selectedShape = ko.observable("");
    self.selectedMetric = ko.observable("Liters");
    self.newTitle = ko.observable("");
    self.newDescription = ko.observable("");
    self.newMetric = ko.observable();
    self.newMainAquarium = ko.observable();
    self.newSump = ko.observable();
    self.newRefugium = ko.observable();
    self.newPropagationTank = ko.observable();
    self.newOtherVolume  = ko.observable();
    self.newimgAquarium = ko.observable();



    /* Load shapes*/
    $.getJSON("http://localhost/ReefTrace/aquariumShape", function(result) {

        var shapeList = $.map(result.shapes, function(item){
            return new AquariumShape(item.shape);
        });
        console.log(shapeList);     
        self.aquariumsShapes(shapeList); 
    });
    /**Load Types*/
    $.getJSON("http://localhost/ReefTrace/aquariumType", function(result) {
        var typeList = $.map(result.typesAquarium, function(item){
            return new AquariumType(item.typeAquarium);
        });
        console.log(typeList);     
        self.types(typeList); 
    });
    /*Load metrics*/
    $.getJSON("http://localhost/ReefTrace/aquariumMetric", function(result) {
        var metricList = $.map(result.metrics, function(item){
            return new AquariumMetric(item.metric);
        });
        console.log(metricList);     
        self.aquariumsMetrics(metricList); 
    });
    /*Load aquariums*/
    self.loadAquariums = function (){
       $.getJSON("http://localhost/ReefTrace/aquariums", function(data) {
          var aquariumList = $.map(data.aquariums, function(item){
              
              return new Aquarium(item.aquarium);
          });
          console.log(aquariumList);     
          self.aquariums(aquariumList); 
      });
    }

    self.loadAquariums();

    self.addAquarium = function(){

      if(imageStringBase64 == null){
        alert('You must select an image!');
        return;
      }

      var base64imagestring = imageStringBase64;
      var filename = imageName;
      var filepath = "public://"+filename;
      var resultId = null;
      var token = Cookies.get('CSRF');

      console.log("Prueba: "+self.newTitle());

      new_shape = self.selectedShape().name;
      new_type = self.selectedType().name;

      new_title = self.newTitle();

      var metricID = self.aquariumsMetrics.find("name", {name: self.selectedMetric()});


      var data = '{"file" : "'+base64imagestring+'", "filename" : "'+filename+'", "filepath" : "'+filepath+'"}';
      /*Add image file*/
      var promise = $.ajax({
        type: 'POST',
        url: "http://localhost/ReefTrace/test/file/",
        datatype:'json',
        contentType: "application/json",
        data: data,
        beforeSend: function (request) {
          request.setRequestHeader("X-CSRF-Token", token);
        },
        success: function(result) {
          //Here is supose to be the function which return the fid and uri values to create a new node with image field
          console.log("LOL");
          console.log(JSON.stringify(result));
          //resultid = result['fid'];
          //return resultid;
          resultId = result.fid;
          console.log(resultId);
        },
        error: function(error) {
          alert('An error ocurred, please try again! \n '+ error);
          //return null;
        },
        
      }).done(function(data){
        console.log("Prueba: "+self.newTitle());
        /*Save image id*/
        resultId = data.fid;

      }); 

      promise.then(function(){
        //console.log("Prueba3: "+self.newTitle()+" "+resultId);
        /*Add aquarium*/
        var newAquarium ='{ "type" : "aquarium", "title" : "'+new_title+'","field_area" : { "und" : [{"value":"'+self.newDescription()+'"}]},"field_type" : {"und": ["'+self.selectedType().idType+'"]},"field_shape" : {"und": ["'+self.selectedShape().idShape+'"]}, "field_metric" : {"und": ["'+metricID.idMetric+'"]}, "field_main_aquarium" : { "und" : [{"value":"'+self.newMainAquarium()+'"}]}, "field_sump" : { "und" : [{"value":"'+self.newSump()+'"}]}, "field_refugium" : { "und" : [{"value":"'+self.newRefugium()+'"}]}, "field_propagation_tank" : { "und" : [{"value":"'+self.newPropagationTank()+'"}]}, "field_other_volume" : { "und" : [{"value":"'+self.newOtherVolume()+'"}]},"field_imgaquarium" : {"und": [{"fid":"'+resultId+'"}]} }';
        
        console.log("Agregando acuario");
        console.log(newAquarium);
        console.log(token);

        $.ajax({
          beforeSend: function (request) {
            request.setRequestHeader("X-CSRF-Token", token);
          },
          type: 'POST',
          url: "http://localhost/ReefTrace/test/node",
          datatype:'json',
          contentType: "application/json",
          data: newAquarium,
          success: function(result) {
            //self.aquariums.push(item);
            $("#ModalAdd").hide();
            self.loadAquariums();
            alert('Correct!');
          },
          error: function(error) {
            console.log(JSON.stringify(error));
            alert('An error ocurred, please try again! \n '+ error);

          }
        });
      });

     }


    self.deleteAquarium = function(item) {
      if(window.confirm("Are you sure you want to delete "+item.title()+"?")){
        var token = Cookies.get('CSRF');
        var nid = item.nid();
        $.ajax({
            beforeSend: function (request) {
              request.setRequestHeader("X-CSRF-Token", token);
            },
            type: 'DELETE',
            url: "http://localhost/ReefTrace/test/node/"+nid,
            contentType: "application/json",
            success: function(result) {
              alert('Deleted!');
              self.aquariums.remove(item);
            },
            error: function(error) {
              alert('An error ocurred, please try again! ');
            }
        }); 
      } 
    }

    self.selectAquariumToUpdate = function (aquarium) {
        console.log(aquarium);


        self.nid(aquarium.nid());

        self.title(aquarium.title());
        self.Description(aquarium.Description());
        self.Shape(aquarium.Shape());
        self.Type(aquarium.Type());
        self.Metric(aquarium.Metric());

        self.selectedShape(self.aquariumsShapes.find("name", {name: aquarium.Shape()}));
        
        self.selectedType(self.types.find("name",{name: aquarium.Type()}));

        self.selectedMetric(aquarium.Metric());

        self.MainAquarium(aquarium.MainAquarium());
        self.Sump(aquarium.Sump());
        self.Refugium(aquarium.Refugium());
        self.PropagationTank(aquarium.PropagationTank());
        self.OtherVolume(aquarium.OtherVolume());
        self.imgAquarium(aquarium.imgAquarium());
        console.log(self.imgAquarium());



    };

    self.cancelUpdate = function(){
      self.title("");
      self.Description("");
      self.Shape("");
      self.Type("");
      self.selectedType("");
      self.selectedShape("");
    }

    self.updateAquarium = function () {
      var token = Cookies.get('CSRF');

      var metricID = self.aquariumsMetrics.find("name", {name: self.selectedMetric()});
      console.log("IDMETRIC: "+metricID.idMetric+" NAme: "+metricID.name);

      var aquarium ='{ "type" : "aquarium", "title" : "'+self.title()+'","field_area" : { "und" : [{"value":"'+self.Description()+'"}]},"field_type" : {"und": ["'+self.selectedType().idType+'"]},"field_shape" : {"und": ["'+self.selectedShape().idShape+'"]}, "field_metric": {"und": ["'+metricID.idMetric+'"]}, "field_main_aquarium" : { "und" : [{"value":"'+self.MainAquarium()+'"}]}, "field_sump" : { "und" : [{"value":"'+self.Sump()+'"}]}, "field_refugium" : { "und" : [{"value":"'+self.Refugium()+'"}]}, "field_propagation_tank" : { "und" : [{"value":"'+self.PropagationTank()+'"}]}, "field_other_volume" : { "und" : [{"value":"'+self.OtherVolume()+'"}]} }';
      
      var auxAqua = {title: self.title(), Description: self.Description(), Shape: self.selectedShape().name, Type: self.selectedType().name, Metric: self.selectedMetric(), MainAquarium: self.MainAquarium(), Sump: self.Sump(), Refugium: self.Refugium(), PropagationTank: self.PropagationTank(), OtherVolume: self.OtherVolume() };
        
        $.ajax({
          beforeSend: function (request) {
            request.setRequestHeader("X-CSRF-Token", token);
          },
          type: 'PUT',
          url: "http://localhost/ReefTrace/test/node/"+self.nid(),
          datatype:'json',
          contentType: "application/json",
          data: aquarium,
          success: function(result) {
            var up = self.aquariums.changeAquarium("nid",{nid: self.nid()}, auxAqua);
            $("#modal-aqurium-update").hide();
            alert('Aquarium Updated: '+up.title());
          },
          error: function(error) {
            alert('An error ocurred, please try again! \n '+ error);
          }

        });
    }



};

ko.applyBindings(new AquariumViewModel());