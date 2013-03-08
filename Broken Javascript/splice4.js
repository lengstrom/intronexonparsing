//Very rough prototype for parsing exons and introns out of a gene. Eventually, I hope to completely redo this, and use techniques detailed by James W. Fickett (to recognize protein coding regions in DNA) and by Berg and von Hippel in their 1987 work on identifying DNA acceptor sites. I also hope to identify many different ways of parsing the DNA, and be able to list them in terms of probaility of accuracy.


//TODO: make functions work concurrently
//after finish a sequence, go onto parse__(orpos)
//set CSS with monospace pt 12

function parseDNA(exwindow,inwindow,mmRNA,DNA) {
  //reccomended settings for exwindow and inwindow are 6 and 70, respectively
  //exwindow = the window in which the program looks for NTs within exons 
  //inwindow = the window in which program looks for NTs within introns
  //split mmRNA into an array with each char
  rseq = mmRNA.split('');
  //split DNA into an array with each char
  console.log(0);
  alert(DNA);
  dseq = DNA.split('');
  //
  var rinitialseq = '';
  var dinitialseq = '';
  var dloc = 0;
  var rloc = 0;
  var introns = [];
  var exons = [];
  console.log(1);
  for (i = 0; i < exwindow;i++) {
    rinitialseq = rinitialseq + rseq[i];
    dinitialseq = dinitialseq + dseq[i];
    console.log(2);
  }
  if (dseq[0] + dseq[1] == 'GT') {
    dloc = inwindow;
    console.log('GT');
    console.log(3);
    parseintrons(0);
    
  }
  else if (rinitialseq == dinitialseq) {
    parseexons(0);
    console.log(4);
  }
  else {
    console.log(5);
    alert('error already');
    exit('erroy at beginning...');
  }
  
  //make more efficient (down)
  function parseintrons(originalposition) {
    var opos = originalposition;
    //local variable to store the position of the first AG
    var AGpos = 0;
    //store position of the second AG
    var AGpos2 = 0;
    //true position of the end of the intron
    var truepos = 0;
    //temporary location of the end of the intron to test whether NTs match up at the end of the intron
    var tempdloc = 0;
    //diff between the two AGs to see whether the NTs between the two are exons
    var AGdiff = 0;
    
    //loop through different nucleotides to find the first AG
    for (i = dseq[dloc]; i < dseq.length; i++) {
      if (dseq[i] + dseq[i+1] == 'AG') {
        AGpos = i;
        console.log('found first AG');
        break;
        tempdloc = i + 2;
        
      }
      //if there are no end AGs, throw an error (impossible)
      else if (i==dseq.length-2) {
        if (dloc == dseq.length) {
          introns.push([opos,dseq.length]);
          console.log(exons);
          console.log(introns);
          
        }
        else {
          alert('Error, bad intron splicing, line 43');
          exit('bad intron sequencing');
          //????
          break;
        }
      }
    }
    
    //check for AG after this one, to make sure that the AG isn't part of the exon
    for (i = AGpos + 2; i < dseq.length; i++) {
      if (dseq[i] + dseq[i+1] == 'AG') {
        AGpos2 = i;
        console.log('found second AG');
        break;
      }
      
      //if there are no more AGs, say that the previously found AG was the last intron
      else if (i==dseq.length - 2) {
        truepos = AGpos;
        dloc = AGpos + 2;
        parseexons(truepos+2);
        console.log(dloc)
          introns.push([opos,truepos]);
        //?????
        break;
      }
    }
    
    //if the difference between the two AGs is
    //if (AGpos2 - AGpos < exwindow) {
    //  dloc = AGpos2;
    //  parseintrons(opos);
    
    //}
    //do stuff. :<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //check to see whether the part between the two AGs are part of the mmRNA, if so, go through parsing again, this time at the location of the 2nd AG found
    AGdiff = AGpos2 - AGpos - 2;
    for (i = 0; i < AGdiff; i++) {
      if (rseq[rloc + i] != dseq[tempdloc + i]) {
        truepos = AGpos;
        dloc = AGpos + 2;
        parseexons(truepos+2);
        introns.push([opos,truepos + 1]);
        console.log(introns);
      }
      
      //if they do match, keep going
      else if (i == AGdiff - 1) {
        dloc = AGpos2;
        parseintrons(originalposition);
        
      }
    }
  }
  function parseexons(orpos) {
    //remember to add in 70 NT window
    //first GT
    var exGTpos = 0;
    //second GT
    var exGTpos2 = 0;
    //end of the exon (might not be necissary?)
    var exend = 0;
    //diff between the two GTs
    var GTdiff = 0;
    
    //find first GT
    for (i = dseq[dloc]; i<dseq.length; i++) {
      if (dseq[i] + dseq[i+1] == 'GT') {
        exGTpos = i;
        break;
      }
      
      //If there isn't a GT, end it.
      else if (i == dseq.length - 2) {
        exons.push([orpos,dseq.length]);
        console.log(exons);
        console.log(introns);
        
      }
    }
    
    //Find second GT
    for (i = exGTpos + 2; i<dseq.length; i++) {
      if (dseq[i] + dseq[i+1] == 'GT') {
        exGTpos2 = i;
        break;
      }
      
      //If there isn't a second GT, do 
      else if (i == dseq.length - 2) {
        
      }
    }
    
    if (exGTpos2 - exGTpos == 0) {
      //Go back to beginning, test whether hte first GT is in the mRNA, if not, state that as the end of the exon, if so, keep going
      var tempgtposdiff = exGTpos2 - orpos;
      
      for (i=0;i<tempgtposdiff;i++) {
        //check for differences, if so, create exon
        if (dseq[dloc + i] != rseq[rloc + i]) {
          exons.push([orpos,exGTpos+1]);
          dloc = exGTpos2 + inwindow + 2;
          rloc = rloc + tempgtposdiff + 1;
          parseintrons(exGTpos2);
          
        }
        //if not... keep going
        else if (i == tempgtposdiff - 1) {
          dloc = exGTpos2;
          rloc = rloc + tempgtposdiff + 2;
          parseexons(orpos);
          
        }
      }
    }
    
    else {
      //get difference
      GTdiff = exGTpos2 - exGTpos - 2;
      
      //using difference, try to find whether there is a difference between GT -> GT and the mRNA that corresponds to i
      for (i = 0; i < GTdiff; i++) {
        if (rseq[rloc + i] !=  dseq[rloc + i]) {
          rloc = rloc + exGTpos2 - orpos;
          dloc = exGTpos2 + 2 + inwindow;
          exons.push([orpos, exGTpos - 1]);
          parseintrons(exGTpos + 2);
          
        }
        
        else if (i == GTdiff - 1) {
          dloc = exGTpos2;
          rloc = rloc + exGTpos2 - orpos + 1;
          parseexons(orpos);
          
        }
      }
    }
  }
  
  function printdata() {
    var rownum = Math.ceil(dseq.length / 80);
    var compare = '';
    var mRNAlist = '';
    var appendedstring = '"';
    for (i = 1; i <= dseq.length;i++) {
      for (q = 0; q < exons.length; q++) {
        if (i >= exons[q][0] || i <= exons[q][1]) {
          mRNAlist = mRNAlist + dseq[i];
          compare = compare + '|';
        } 
        else {
          mRNAlist = mRNAlist + '-';
          compare = compare + '&nbsp;';
        }
      }
    }
    //finish dis
    for (i = 0; i < rownum; i++) {
      appendedstring = appendedstring + "<div class = 'display'>" + dseq.splice(i * 80, (i + 1) * 80 - 1).toString() + "</div>" + "<div class = 'display'>" + compare.substr(i*80, (i + 1) * 80 - 1) + "</div>" + "<div class = 'display'>" + mRNAlist.substr(i*80, (i + 1) * 80 - 1) + "</div>";
    }
    $('#holder').append(appendedstring);
  }
}