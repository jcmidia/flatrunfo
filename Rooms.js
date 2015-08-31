function Room(id) {
  this.id = id;
  this.people = [];
  this.peopleLimit = 2;
  this.status = "available";
  this.private = false;
  this.turno = 1;
};

Room.prototype.addPerson = function(personID) {
  if (this.status === "available") {
    this.people.push(personID);
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
  return this.available === "available";
};

Room.prototype.isPrivate = function() {
  return this.private;
};

module.exports = Room;