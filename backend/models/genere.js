const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define nested schema for 'relationships'
const relationshipSchema = new Schema({
  id: String,
  relation: String
});

// Define nested schema for 'parents'
const parentsSchema = new Schema({
  father: String,
  mother: String
});

// Main schema for the inquiry record
const genereSchema = new Schema({
  _id: String,
  DescriptionLevel: String,
  EntityType: String,
  CompleteUnitId: String,
  UnitId: String,
  RepositoryCode: String,
  CountryCode: String,
  UnitTitleType: String,
  UnitTitle: String,
  AlternativeTitle: String,
  NormalizedFormsName: String,
  OtherFormsName: String,
  UnitDateInitial: Date,
  UnitDateFinal: Date,
  UnitDateInitialCertainty: Boolean,
  UnitDateFinalCertainty: Boolean,
  AllowUnitDatesInference: Boolean,
  AccumulationDates: String,
  UnitDateBulk: String,
  UnitDateNotes: String,
  Dimensions: String,
  AllowExtentsInference: Boolean,
  Repository: String,
  Producer: String,
  Author: String,
  MaterialAuthor: String,
  Contributor: String,
  Recipient: String,
  BiogHist: String,
  LegalStatus: String,
  Functions: String,
  Authorities: String,
  InternalStructure: String,
  GeneralContext: String,
  CustodHist: String,
  AcqInfo: String,
  Classifier: String,
  ScopeContent: String,
  Terms: String,
  DocumentalTradition: String,
  DocumentalTypology: String,
  Marks: String,
  Monograms: String,
  Stamps: String,
  Inscriptions: String,
  Signatures: String,
  Appraisal: String,
  AppraisalElimination: String,
  AppraisalEliminationDate: String,
  Accruals: String,
  Arrangement: String,
  AccessRestrict: String,
  UseRestrict: String,
  PhysLoc: String,
  OriginalNumbering: String,
  PreviousLoc: String,
  LangMaterial: String,
  PhysTech: String,
  OtherFindAid: String,
  ContainerTypeTerm: String,
  OriginalsLoc: String,
  AltFormAvail: String,
  RelatedMaterial: String,
  Note: String,
  AllowTextualContentInference: Boolean,
  TextualContent: String,
  RetentionDisposalDocumentState: String,
  ApplySelectionTable: Boolean,
  RetentionDisposalPolicy: String,
  RetentionDisposalReference: String,
  RetentionDisposalClassification: String,
  RetentionDisposalPeriod: String,
  RetentionDisposalApplyDate: String,
  RetentionDisposalFinalDestination: String,
  RetentionDisposalObservations: String,
  DescRules: String,
  Revised: Boolean,
  Published: Boolean,
  Available: Boolean,
  Highlighted: Boolean,
  Creator: String,
  Created: Date,
  Username: String,
  ProcessInfoDate: Date,
  OtherDescriptiveData: String,
  ProcessInfo: String,
  relationships: [relationshipSchema],
  parents: parentsSchema
});


const Genere = mongoose.model('genere', genereSchema, 'genere');

module.exports = Genere;
