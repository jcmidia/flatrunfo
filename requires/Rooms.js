function Room(id) {
  this.id = id;
  this.people = [];
  this.peopleLimit = 2;
  this.status = "Disponível";
  this.private = false;
  this.turno = 1;
  this.time=300000;
};

Room.prototype.addPerson = function(personID) {
  if (this.status === "Disponível") {
    this.people.push(personID);
  }
  if (this.people.length==this.peopleLimit) {
    this.status="Ocupada";
  }
};

Room.prototype.removePerson = function(personID) {

  var personIndex = -1;
  for(var i = 0; i < this.people.length; i++){
    if(this.people[i] == personID){
      personIndex = i;
      break;
    }
  }

  this.people.splice(personIndex, 1);
};

Room.prototype.getPerson = function(personID) {
  var person = null;
  for(var i = 0; i < this.people.length; i++) {
    if(this.people[i].id == personID) {
      person = this.people[i];
      break;
    }
  }
  return person;
};

Room.prototype.getPersonIndex = function(personID) {
  var index = null;
  for(var i = 0; i <= this.people.length; i++) {
    if(this.people[i] == personID) {
      index = i;
      break;
    }
  }
  return index;
};

Room.prototype.isAvailable = function() {
  return this.status === "Disponível";
};

Room.prototype.isPrivate = function() {
  return this.private;
};

module.exports = Room;