export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  points: number;
  options: Option[];
  correctOptionId: string;
}

export const mockTest1Questions: Question[] = [
  {
    id: 1,
    text: "Which one is Engineer Scale?",
    points: 1,
    options: [
      { id: "1", text: "1:50000" },
      { id: "2", text: "1:50000" },
      { id: "3", text: "100''=10'" },
      { id: "4", text: "None of above" }
    ],
    correctOptionId: "3"
  },
  {
    id: 2,
    text: "Which one is not an example of Land Reform System?",
    points: 1,
    options: [
      { id: "1", text: "Land Consolidation" },
      { id: "2", text: "Land Tenure Reform" },
      { id: "3", text: "Agrarian Cultivation" },
      { id: "4", text: "Land Registration" }
    ],
    correctOptionId: "4"
  },
  {
    id: 3,
    text: "Select the correct statement about braced quadrilateral.",
    points: 1,
    options: [
      { id: "1", text: "Triangles are overlapped." },
      { id: "2", text: "It contain at least one right angled triangle" },
      { id: "3", text: "It doesn't contain triangle and only contains quadrilateral." },
      { id: "4", text: "It has two diagonal with intersection node at overlapping." }
    ],
    correctOptionId: "1"
  },
  {
    id: 4,
    text: "What is the structure called that is built up to stop the sudden flood and utilize water when necessary?",
    points: 1,
    options: [
      { id: "1", text: "Storage Dam" },
      { id: "2", text: "Detention Dam" },
      { id: "3", text: "Coffer Dam" },
      { id: "4", text: "Diversion Dam" }
    ],
    correctOptionId: "2"
  },
  {
    id: 5,
    text: "The lowest RL of bottom of inner surface of pipe is called",
    points: 1,
    options: [
      { id: "1", text: "Invert" },
      { id: "2", text: "Bed" },
      { id: "3", text: "Grade" },
      { id: "4", text: "Negetive RL" }
    ],
    correctOptionId: "1"
  },
  {
    id: 6,
    text: "How many reflection does it occur in 3D?",
    points: 1,
    options: [
      { id: "1", text: "2" },
      { id: "2", text: "3" },
      { id: "3", text: "6" },
      { id: "4", text: "9" }
    ],
    correctOptionId: "2"
  },
  {
    id: 7,
    text: "Which is not a True RDBMS?",
    points: 1,
    options: [
      { id: "1", text: "SQL Server" },
      { id: "2", text: "Oracle" },
      { id: "3", text: "Access" },
      { id: "4", text: "PostgreSQL" }
    ],
    correctOptionId: "4"
  },
  {
    id: 8,
    text: "The difference between theoretical gravity and observed gravity is",
    points: 1,
    options: [
      { id: "1", text: "Gravity Anomaly" },
      { id: "2", text: "Gravity Potential" },
      { id: "3", text: "Absolute Gravity" },
      { id: "4", text: "Relative Gravity" }
    ],
    correctOptionId: "1"
  },
  {
    id: 9,
    text: "When was Guthi Act enacted?",
    points: 1,
    options: [
      { id: "1", text: "1956" },
      { id: "2", text: "1966" },
      { id: "3", text: "1976" },
      { id: "4", text: "1996" }
    ],
    correctOptionId: "3"
  },
  {
    id: 10,
    text: "Who mapped the first map in Cartography?",
    points: 1,
    options: [
      { id: "1", text: "Leonardo Da Vinci" },
      { id: "2", text: "Gerardus Mercator" },
      { id: "3", text: "Anaximander" },
      { id: "4", text: "Robert Tomilson" }
    ],
    correctOptionId: "3"
  },
  {
    id: 11,
    text: "What is the data called which is stored in DBMS at the moment?",
    points: 1,
    options: [
      { id: "1", text: "Instances" },
      { id: "2", text: "Relation" },
      { id: "3", text: "Schema" },
      { id: "4", text: "File" }
    ],
    correctOptionId: "1"
  },
  {
    id: 12,
    text: "Which survey defines the boundaries, parcel and houses?",
    points: 1,
    options: [
      { id: "1", text: "Cadastral Survey" },
      { id: "2", text: "Topographical Survey" },
      { id: "3", text: "Tacheometry" },
      { id: "4", text: "City Survey" }
    ],
    correctOptionId: "1"
  },
  {
    id: 13,
    text: "What is known by the term 'Vertical Exaggeration'?",
    points: 1,
    options: [
      { id: "1", text: "Scale of Vertical is larger than Horizontal Scale" },
      { id: "2", text: "Scale of Horizontal larger than Vertical Scale" },
      { id: "3", text: "Slope is seen more than flatten" },
      { id: "4", text: "All the statement is incorrect" }
    ],
    correctOptionId: "2"
  },
  {
    id: 14,
    text: "Contingent Project refers to...........",
    points: 1,
    options: [
      { id: "1", text: "Decision is made by a group and wont affect others decision" },
      { id: "2", text: "Decision is made with a small impact of others decision" },
      { id: "3", text: "Decision is made on mutual co-operation" },
      { id: "4", text: "Decision is made by other group" }
    ],
    correctOptionId: "3"
  },
  {
    id: 15,
    text: "The length of chain is measured from .......... of one handle to ............. of other handle.",
    points: 1,
    options: [
      { id: "1", text: "Inside, Inside" },
      { id: "2", text: "Outside, Inside" },
      { id: "3", text: "Center, Center" },
      { id: "4", text: "Outside, Outside" }
    ],
    correctOptionId: "4"
  },
  {
    id: 16,
    text: "Which one of the following is based on VGI?",
    points: 1,
    options: [
      { id: "1", text: "Google Maps" },
      { id: "2", text: "ENVI" },
      { id: "3", text: "Wikimapia" },
      { id: "4", text: "ArcGIS" }
    ],
    correctOptionId: "3"
  },
  {
    id: 17,
    text: "Pseudoscopic Vision in stereo photogrammetry is",
    points: 1,
    options: [
      { id: "1", text: "Normal 3D vision from two overlapping photos" },
      { id: "2", text: "Reversed 3D vision from two overlapping photos" },
      { id: "3", text: "Neutral 3D vision from two overlapping photos" },
      { id: "4", text: "Artificial 3D vision from a single photo" }
    ],
    correctOptionId: "2"
  },
  {
    id: 18,
    text: "Which software was used for gravity data processing in Sagarmatha height measurement project in Nepal?",
    points: 1,
    options: [
      { id: "1", text: "TBC" },
      { id: "2", text: "GRAVSOFT" },
      { id: "3", text: "GRAVITYSOFT" },
      { id: "4", text: "Python" }
    ],
    correctOptionId: "2"
  },
  {
    id: 19,
    text: "Isostasy in Gravity Reduction depends on .............Principle.",
    points: 1,
    options: [
      { id: "1", text: "Upthrust" },
      { id: "2", text: "Pressure" },
      { id: "3", text: "Archimedes Principle" },
      { id: "4", text: "Newtons Law" }
    ],
    correctOptionId: "1"
  },
  {
    id: 20,
    text: "When was the photograph of earth (BLUE MARBLE) taken?",
    points: 1,
    options: [
      { id: "1", text: "1852" },
      { id: "2", text: "1929" },
      { id: "3", text: "1964" },
      { id: "4", text: "1972" }
    ],
    correctOptionId: "4"
  },
  {
    id: 21,
    text: "What is the formula to calculate acceleration?",
    points: 1,
    options: [
      { id: "1", text: "a=f+g" },
      { id: "2", text: "a=f-g" },
      { id: "3", text: "g=f-a" },
      { id: "4", text: "a=f/g" }
    ],
    correctOptionId: "1"
  },
  {
    id: 22,
    text: "Dynamics Chart and Graphs is used for.......",
    points: 1,
    options: [
      { id: "1", text: "Visualization based Data Mining" },
      { id: "2", text: "Annotation" },
      { id: "3", text: "Symbology" },
      { id: "4", text: "Map Interpretation" }
    ],
    correctOptionId: "1"
  },
  {
    id: 23,
    text: "What is the orthophoto specific for?",
    points: 1,
    options: [
      { id: "1", text: "True Distance" },
      { id: "2", text: "False Distance" },
      { id: "3", text: "Fire Areas" },
      { id: "4", text: "True Shape and Size" }
    ],
    correctOptionId: "1"
  },
  {
    id: 24,
    text: "Which light is used in LIDAR for bathymetry?",
    points: 1,
    options: [
      { id: "1", text: "Red" },
      { id: "2", text: "Blue" },
      { id: "3", text: "Short Wave Infrared" },
      { id: "4", text: "Near Infrared" }
    ],
    correctOptionId: "2"
  },
  {
    id: 25,
    text: "Which of the following is not the GNSS observable?",
    points: 1,
    options: [
      { id: "1", text: "Carrier Phase" },
      { id: "2", text: "Code/Pseudorange" },
      { id: "3", text: "Doppler Frequency" },
      { id: "4", text: "Antenna and receiver characteristics" }
    ],
    correctOptionId: "4"
  },
  {
    id: 26,
    text: "The accuracy of DEM (footprint) depends on.........",
    points: 1,
    options: [
      { id: "1", text: "Grid Density" },
      { id: "2", text: "Grid Structure" },
      { id: "3", text: "Point Accuracy" },
      { id: "4", text: "Contrast Enhancement" }
    ],
    correctOptionId: "4"
  },
  {
    id: 27,
    text: "What is the angle between Plumb line and ellipsoidal normal called?",
    points: 1,
    options: [
      { id: "1", text: "Deflection of vertical" },
      { id: "2", text: "Deflection of Parallel" },
      { id: "3", text: "Deflection Angle" },
      { id: "4", text: "Right Ascension" }
    ],
    correctOptionId: "1"
  },
  {
    id: 28,
    text: "In the altitude and azimuth system of coordinates, the reference plane is",
    points: 1,
    options: [
      { id: "1", text: "equator" },
      { id: "2", text: "horizon" },
      { id: "3", text: "ecliptic" },
      { id: "4", text: "prime vertical" }
    ],
    correctOptionId: "2"
  },
  {
    id: 29,
    text: "Which of the positioning is used for the establishment of most accurate reference stations?",
    points: 1,
    options: [
      { id: "1", text: "Static Positioning" },
      { id: "2", text: "Pseudo-kinematic Positioning" },
      { id: "3", text: "Kinematic Positioning" },
      { id: "4", text: "Pseudo-static Positioning" }
    ],
    correctOptionId: "1"
  },
  {
    id: 30,
    text: "Which scale represents the temperature?",
    points: 1,
    options: [
      { id: "1", text: "Nominal" },
      { id: "2", text: "Ratio" },
      { id: "3", text: "Interval" },
      { id: "4", text: "Ordinal" }
    ],
    correctOptionId: "3"
  },
  {
    id: 31,
    text: "The instrument used for enlargement and reduction of map is............",
    points: 1,
    options: [
      { id: "1", text: "Perimeter" },
      { id: "2", text: "Photograph" },
      { id: "3", text: "Proportional Divider" },
      { id: "4", text: "both b and c" }
    ],
    correctOptionId: "4"
  },
  {
    id: 32,
    text: "Which projection system is used in recent new administrative map of Nepal?",
    points: 1,
    options: [
      { id: "1", text: "UTM" },
      { id: "2", text: "MUTM" },
      { id: "3", text: "LCC" },
      { id: "4", text: "EVEREST 1830" }
    ],
    correctOptionId: "3"
  },
  {
    id: 33,
    text: "What is the minimum degree required to get recognize as Professional Engineer?",
    points: 1,
    options: [
      { id: "1", text: "Bachelor Degree" },
      { id: "2", text: "Master Degree" },
      { id: "3", text: "Diploma" },
      { id: "4", text: "Intermediate School" }
    ],
    correctOptionId: "2"
  },
  {
    id: 34,
    text: "Which is the oldest method of representing the task?",
    points: 1,
    options: [
      { id: "1", text: "Bar Chart" },
      { id: "2", text: "Milestone Chart" },
      { id: "3", text: "CPM" },
      { id: "4", text: "PERT" }
    ],
    correctOptionId: "1"
  },
  {
    id: 35,
    text: "The OGC standard for the retrieve and query of data is...",
    points: 1,
    options: [
      { id: "1", text: "WMS" },
      { id: "2", text: "WFS" },
      { id: "3", text: "WCS" },
      { id: "4", text: "WPS" }
    ],
    correctOptionId: "2"
  },
  {
    id: 36,
    text: "...........is the data classification based on equal number of features.",
    points: 1,
    options: [
      { id: "1", text: "Equal range" },
      { id: "2", text: "Quantile" },
      { id: "3", text: "Geometrical Interval" },
      { id: "4", text: "Natural Break" }
    ],
    correctOptionId: "2"
  },
  {
    id: 37,
    text: "Which point has zero water accumulation in watershed analysis?",
    points: 1,
    options: [
      { id: "1", text: "Depression" },
      { id: "2", text: "Ridge" },
      { id: "3", text: "Pits" },
      { id: "4", text: "Valley" }
    ],
    correctOptionId: "2"
  },
  {
    id: 38,
    text: "Which one is incorrect statement in CPM?",
    points: 1,
    options: [
      { id: "1", text: "The arrow represents the activity in Project Planning Network" },
      { id: "2", text: "The tail of arrow denotes the starting of the project" },
      { id: "3", text: "The tail of arrow denotes end of project" },
      { id: "4", text: "The arrow always start from left to right direction" }
    ],
    correctOptionId: "3"
  },
  {
    id: 39,
    text: "Which of the following is managed by Terra SpaceCraft?",
    points: 1,
    options: [
      { id: "1", text: "MODIS and MISR" },
      { id: "2", text: "Landsat" },
      { id: "3", text: "Sentinel 5" },
      { id: "4", text: "IRS and CEOS" }
    ],
    correctOptionId: "1"
  },
  {
    id: 40,
    text: "Gravimeter measures",
    points: 1,
    options: [
      { id: "1", text: "relative gravity" },
      { id: "2", text: "absolute gravity" },
      { id: "3", text: "relative gravitational potential" },
      { id: "4", text: "absolute gravitational potential" }
    ],
    correctOptionId: "1"
  },
  {
    id: 41,
    text: "Why is face left and face right data taken in a theodolite?",
    points: 1,
    options: [
      { id: "1", text: "To reduce collimation error" },
      { id: "2", text: "To eliminate collimation error" },
      { id: "3", text: "To decrease zero error" },
      { id: "4", text: "To eliminate index error" }
    ],
    correctOptionId: "2"
  },
  {
    id: 42,
    text: "In NGO, organizational structure, the role of technical working group is:",
    points: 1,
    options: [
      { id: "1", text: "Facilitate the implementation of the decisions" },
      { id: "2", text: "Make recommendations to the Forum or Network" },
      { id: "3", text: "Undertake the networking management functions and linkage with the other IGO initiatives" },
      { id: "4", text: "Draft standards, policies, suggest capacity building programs" }
    ],
    correctOptionId: "4"
  },
  {
    id: 43,
    text: "Which of the following measures the Radiant Energy?",
    points: 1,
    options: [
      { id: "1", text: "Spectral Resolution" },
      { id: "2", text: "Temporal Resolution" },
      { id: "3", text: "Spatial Resolution" },
      { id: "4", text: "Radiometric Resolution" }
    ],
    correctOptionId: "4"
  },
  {
    id: 44,
    text: "Which of the following is not the error in digitization?",
    points: 1,
    options: [
      { id: "1", text: "Undershoot" },
      { id: "2", text: "Overshoot" },
      { id: "3", text: "Dangling node" },
      { id: "4", text: "Dangling Polygon" }
    ],
    correctOptionId: "4"
  },
  {
    id: 45,
    text: "What is the full form of SLD?",
    points: 1,
    options: [
      { id: "1", text: "Styling Layer Descriptor" },
      { id: "2", text: "Styled Layer Descriptor" },
      { id: "3", text: "Styled Layer Description" },
      { id: "4", text: "Styling Layer Description" }
    ],
    correctOptionId: "2"
  },
  {
    id: 46,
    text: "The principle of least squares can be formed from......",
    points: 1,
    options: [
      { id: "1", text: "Probability Equation" },
      { id: "2", text: "Normal Equation" },
      { id: "3", text: "Celestial Equation" },
      { id: "4", text: "Observed Equation" }
    ],
    correctOptionId: "1"
  },
  {
    id: 47,
    text: "Contour lines close to each other indicates........ slope",
    points: 1,
    options: [
      { id: "1", text: "Steep" },
      { id: "2", text: "Gentle" },
      { id: "3", text: "Uniform" },
      { id: "4", text: "Undulated" }
    ],
    correctOptionId: "1"
  },
  {
    id: 48,
    text: "LIS was first endorsed by government in .......... periodic plan.",
    points: 1,
    options: [
      { id: "1", text: "6th" },
      { id: "2", text: "7th" },
      { id: "3", text: "8th" },
      { id: "4", text: "10th" }
    ],
    correctOptionId: "3"
  },
  {
    id: 49,
    text: "The initial task to be performed in Engineering Survey is to carry out",
    points: 1,
    options: [
      { id: "1", text: "Preliminary Survey" },
      { id: "2", text: "Reconnaissance" },
      { id: "3", text: "Planning" },
      { id: "4", text: "Location Survey" }
    ],
    correctOptionId: "3"
  },
  {
    id: 50,
    text: "The filter used for detection of linear geographic features in Image Enhancement is...",
    points: 1,
    options: [
      { id: "1", text: "Low Pass Filter" },
      { id: "2", text: "Gradient Pass Filter" },
      { id: "3", text: "Statistical Pass Filter" },
      { id: "4", text: "High Pass Filter" }
    ],
    correctOptionId: "4"
  },
  {
    id: 51,
    text: "The underground horizontal passage open to atmosphere at both ends is known as...",
    points: 1,
    options: [
      { id: "1", text: "Tunnel" },
      { id: "2", text: "Adit" },
      { id: "3", text: "Gangway" },
      { id: "4", text: "Shaft" }
    ],
    correctOptionId: "1"
  },
  {
    id: 52,
    text: "In Positioning, CORS refers",
    points: 1,
    options: [
      { id: "1", text: "Continuously Operating Reference System" },
      { id: "2", text: "Continuously Operating Reference Stations" },
      { id: "3", text: "Continuously Operating Remote System" },
      { id: "4", text: "Continue Operating Rover Station" }
    ],
    correctOptionId: "2"
  },
  {
    id: 53,
    text: "The ability of different systems or software to exchange, interpret, and make use of data is called:",
    points: 1,
    options: [
      { id: "1", text: "Data Security" },
      { id: "2", text: "Data Interoperability" },
      { id: "3", text: "Data Sharing" },
      { id: "4", text: "Data Storing" }
    ],
    correctOptionId: "2"
  },
  {
    id: 54,
    text: "The temporary framework which is useful in construction, demolition, maintenance or repair works is known as....",
    points: 1,
    options: [
      { id: "1", text: "Shutting" },
      { id: "2", text: "Scaffolding" },
      { id: "3", text: "Shoring" },
      { id: "4", text: "Underpinning" }
    ],
    correctOptionId: "2"
  },
  {
    id: 55,
    text: "Which of the statement is false about Kalman Filtering?",
    points: 1,
    options: [
      { id: "1", text: "It is an iterative process." },
      { id: "2", text: "If Kalman Gain is higher, error in measurement is high." },
      { id: "3", text: "If KG=1 all estimate are accurate." },
      { id: "4", text: "If KG=1, measurement is accurate." }
    ],
    correctOptionId: "2"
  },
  {
    id: 56,
    text: "When was Land Use Policy endorsed?",
    points: 1,
    options: [
      { id: "1", text: "2069" },
      { id: "2", text: "2072" },
      { id: "3", text: "2076" },
      { id: "4", text: "2079" }
    ],
    correctOptionId: "2"
  },
  {
    id: 57,
    text: "Amount of Scrap sits in ......... in project controlling.",
    points: 1,
    options: [
      { id: "1", text: "Prevention Cost" },
      { id: "2", text: "Appraisal Cost" },
      { id: "3", text: "Internal Failure Cost" },
      { id: "4", text: "External Failure Cost" }
    ],
    correctOptionId: "3"
  },
  {
    id: 58,
    text: "Which of the following is true about Dummy?",
    points: 1,
    options: [
      { id: "1", text: "It simplifies the network" },
      { id: "2", text: "It doesn't have latest activity event" },
      { id: "3", text: "It can be added anywhere in network" },
      { id: "4", text: "It doesn't consume resources" }
    ],
    correctOptionId: "4"
  },
  {
    id: 59,
    text: "Who appoints the chairman of NEC?",
    points: 1,
    options: [
      { id: "1", text: "Government of Nepal" },
      { id: "2", text: "President of Nepal" },
      { id: "3", text: "Ministry of Home Affairs" },
      { id: "4", text: "Supreme Court" }
    ],
    correctOptionId: "1"
  },
  {
    id: 60,
    text: "NEC consists of at least ......... women as its member",
    points: 1,
    options: [
      { id: "1", text: "4" },
      { id: "2", text: "5" },
      { id: "3", text: "6" },
      { id: "4", text: "7" }
    ],
    correctOptionId: "1"
  },
  {
    id: 61,
    text: "Convert 8551 sq. meter into Bigaha system.",
    points: 2,
    options: [
      { id: "1", text: "1:5:4.84" },
      { id: "2", text: "1:0:5" },
      { id: "3", text: "1:5:0.32" },
      { id: "4", text: "1:5:5.03" }
    ],
    correctOptionId: "4"
  },
  {
    id: 62,
    text: "If θ1 and θ2 are the angles of deviation from A to the top and bottom of a vertically held rod of length S at B, the horizontal distance AB is (Both angles are on the same side).",
    points: 2,
    options: [
      { id: "1", text: "S/(tan θ1−tan θ2)" },
      { id: "2", text: "S/(tan θ1+tan θ2)" },
      { id: "3", text: "S/(tan θ2−tan θ1)" },
      { id: "4", text: "S/(tan θ1×tan θ2)" }
    ],
    correctOptionId: "1"
  },
  {
    id: 63,
    text: "Kappa Coefficient measures..........",
    points: 2,
    options: [
      { id: "1", text: "how accurately a class on the ground is classified" },
      { id: "2", text: "likelihood that a classified pixel represents the actual class on the ground" },
      { id: "3", text: "compares classification accuracy to random chance" },
      { id: "4", text: "percentage of correctly classified pixels across all classes" }
    ],
    correctOptionId: "3"
  },
  {
    id: 64,
    text: "If 16 flight lines are run perpendicular to an area of 30 km, their spacing in a photographical scale 1:50000 will be...........",
    points: 2,
    options: [
      { id: "1", text: "2cm" },
      { id: "2", text: "3cm" },
      { id: "3", text: "4cm" },
      { id: "4", text: "5cm" }
    ],
    correctOptionId: "3"
  },
  {
    id: 65,
    text: "Height given by GPS receiver is:",
    points: 2,
    options: [
      { id: "1", text: "Usually the height above (or below) the Ellipsoid/Spheroid" },
      { id: "2", text: "Usually the height above (or below) the M.S.L" },
      { id: "3", text: "Usually the height above (or below) the terrain" },
      { id: "4", text: "Usually the height above (or below) the ground water level" }
    ],
    correctOptionId: "1"
  },
  {
    id: 66,
    text: "The L.M.T. at a place having a longitude 92°E when the standard time is 10th and the standard meridian is 78°E is:",
    points: 2,
    options: [
      { id: "1", text: "0h" },
      { id: "2", text: "10h" },
      { id: "3", text: "11h" },
      { id: "4", text: "22h" }
    ],
    correctOptionId: "3"
  },
  {
    id: 67,
    text: "What is the sheet number of sheet East to the sheet 120°-150°101?",
    points: 2,
    options: [
      { id: "1", text: "100°-130° 101" },
      { id: "2", text: "130°-150° 101" },
      { id: "3", text: "150°-121° 101" },
      { id: "4", text: "175°1521° 101" }
    ],
    correctOptionId: "2"
  },
  {
    id: 68,
    text: "Which of the following are in correct order?",
    points: 2,
    options: [
      { id: "1", text: "Adjudication, mapping, demarcation, registration" },
      { id: "2", text: "Demarcation, adjudication, mapping, registration" },
      { id: "3", text: "Adjudication, demarcation, mapping, registration" },
      { id: "4", text: "Adjudication, demarcation, registration, mapping" }
    ],
    correctOptionId: "3"
  },
  {
    id: 69,
    text: "Which of the following is not the property of noise in GNSS SIGNAL?",
    points: 2,
    options: [
      { id: "1", text: "White Noise" },
      { id: "2", text: "Gaussian Noise" },
      { id: "3", text: "Random Noise" },
      { id: "4", text: "Thermal Noise" }
    ],
    correctOptionId: "4"
  },
  {
    id: 70,
    text: "GPS satellite belongs to the following category-",
    points: 2,
    options: [
      { id: "1", text: "GEO" },
      { id: "2", text: "LEO" },
      { id: "3", text: "MEO" },
      { id: "4", text: "HEO" }
    ],
    correctOptionId: "3"
  },
  {
    id: 71,
    text: "If a map of scale 1:1000 is enlarged to 1:5000, the percentage of enlargement is __?",
    points: 2,
    options: [
      { id: "1", text: "100" },
      { id: "2", text: "200" },
      { id: "3", text: "50" },
      { id: "4", text: "25" }
    ],
    correctOptionId: "3"
  },
  {
    id: 72,
    text: "How many points have the same coordinate value within Nepal for the MUTM system?",
    points: 2,
    options: [
      { id: "1", text: "2" },
      { id: "2", text: "3" },
      { id: "3", text: "all points have unique coordinate value" },
      { id: "4", text: "4" }
    ],
    correctOptionId: "3"
  },
  {
    id: 73,
    text: "Which query must be used to replace the query SELECT * FROM Student, Courses WHERE Student_ID = Courses_ID?",
    points: 2,
    options: [
      { id: "1", text: "SELECT * FROM Student_ID, Courses_ID WHERE Student_ID = Courses_ID" },
      { id: "2", text: "SELECT * FROM Student_ID, Courses WHERE Student_ID = Courses_ID" },
      { id: "3", text: "SELECT Name_ID FROM Student_Join Courses" },
      { id: "4", text: "SELECT * FROM Student Join Courses ON Student_ID = Courses_ID" }
    ],
    correctOptionId: "4"
  },
  {
    id: 74,
    text: "What language consists of INSERT INTO function?",
    points: 2,
    options: [
      { id: "1", text: "Data Definition Language" },
      { id: "2", text: "Data Manipulation Language" },
      { id: "3", text: "Data Control Language" },
      { id: "4", text: "Both B and C" }
    ],
    correctOptionId: "2"
  },
  {
    id: 75,
    text: "Which of the following is true in the point in the overlay operation?",
    points: 2,
    options: [
      { id: "1", text: "Lines take the attributes of the coincident point" },
      { id: "2", text: "Point take the attributes of the coincident line" },
      { id: "3", text: "Line change their location" },
      { id: "4", text: "Lines and point takes the attribute of each other" }
    ],
    correctOptionId: "2"
  },
  {
    id: 76,
    text: "Find the direction in which water flows using D8-Rule in Watershed Analysis if cell size is 30 m. Given elevation grid: [[80, 74, 63], [69, 67, 56], [60, 52, 48]].",
    points: 2,
    options: [
      { id: "1", text: "52" },
      { id: "2", text: "56" },
      { id: "3", text: "48" },
      { id: "4", text: "60" }
    ],
    correctOptionId: "2"
  },
  {
    id: 77,
    text: "The tangent length will be equal to the radius of the curve if intersection angle is:",
    points: 2,
    options: [
      { id: "1", text: "45" },
      { id: "2", text: "90" },
      { id: "3", text: "120" },
      { id: "4", text: "60" }
    ],
    correctOptionId: "2"
  },
  {
    id: 78,
    text: "In the latitude and SMD method, the reference meridian of traverse should pass through:",
    points: 2,
    options: [
      { id: "1", text: "Most westward station" },
      { id: "2", text: "Any station" },
      { id: "3", text: "First station" },
      { id: "4", text: "Most Eastward station" }
    ],
    correctOptionId: "1"
  },
  {
    id: 79,
    text: "A bank is starting its nominal interest rate of 5% p.a. and compounded quarterly. Calculate effective interest rate in semi annual",
    points: 2,
    options: [
      { id: "1", text: "5%" },
      { id: "2", text: "5.25%" },
      { id: "3", text: "4.65%" },
      { id: "4", text: "5.5%" }
    ],
    correctOptionId: "2"
  },
  {
    id: 80,
    text: "As per NEC act 30 (b), the punishment on violation of rule is:",
    points: 2,
    options: [
      { id: "1", text: "5000" },
      { id: "2", text: "10000" },
      { id: "3", text: "25000" },
      { id: "4", text: "30000" }
    ],
    correctOptionId: "3"
  }
];