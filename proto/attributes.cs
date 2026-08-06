using System;

namespace MP.Mission.Data.Core
{
    /// <summary>
    /// Mission piece attribute identifications
    /// </summary>
    public static class AttributeIDs
    {

        #region Mission Attributes

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route calculation state.
        ///
        ///              The type of the value of the attribute is an enum CalculationState
        /// </summary>
        public const string RTE_MISSION_CALCULATION_STATE = "MissionCalcState";

        /// <summary>
        ///              This constant is the ID of a mission attribute.
        ///
        ///              The attribute is modified when the calculation is completed.
        ///
        ///              The type of the value of the attribute is an boolean
        /// </summary>
        public const string RTE_MISSION_CALCULATION_COMPLETED = "MissionCalculationCompleted";

        /// <summary>
        ///              This constant is the ID of a mission attribute.
        ///
        ///              The value of the attribute is the route data set name
        ///              such as a file name.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string MSN_NAME = "MissionName";

        /// <summary>
        ///              This constant is the ID of a mission attribute.
        ///
        ///              The value of the attribute is the DAFIF database
        ///              effective date when the mission was last updated.
        ///
        ///              The type of the value of the attribute is a DateTime.
        /// </summary>
        public const string MSN_DAFIF_DATE = "DafifDate";

        /// <summary>
        ///              This constant is the ID of a mission attribute.
        ///
        ///              The value of the attribute is the mission dirty flag.
        ///
        ///              The type of the value of the attribute is a bool.
        /// </summary>
        public const string MSN_DIRTY_FLAG = "DirtyFlag";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is route remarks.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string MSN_REMARKS = "MissionRemarks";


        #endregion

        #region Route Attributes

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route creation date.
        ///
        ///              The type of the value of the attribute is a Date.
        /// </summary>
        public const string RTE_CREATION_DATE = "CreateDate";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route classification.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_CLASSIFICATION = "Class";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route calculation status.
        ///
        ///              The type of the value of the attribute is an object RouteCalcualtionStatus
        /// </summary>
        public const string RTE_CALCULATION_STATUS = "CalcStatus";
        

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route calculation state.
        ///
        ///              The type of the value of the attribute is an enum CalculationState
        /// </summary>
        public const string RTE_ROUTE_CALCULATION_STATE = "RouteCalcState";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the option for calculating
        ///              and drawing route legs by great circle or rhumbline.
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration MP.Core.Navigation DistanceFormula.
        /// </summary>
        public const string RTE_HEADING_OPTION = "HeadingOption";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the path name. Route names
        ///              default to "Route1", "Route2", etc.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_ROUTE_NAME = "RouteName";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is route remarks.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_ROUTE_REMARKS = "RouteRemark";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is a flag indicating whether
        ///              a negative fuel condition was detected by Calc.
        ///
        ///              The type of the value of the attribute is a bool.
        /// </summary>
        public const string RTE_ROUTE_NEG_FUEL_FLAG = "NegativeFuelCalculationFlag";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the bingo fuel.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (pounds)
        /// </summary>
        public const string RTE_BINGO_FUEL = "BingoFuel";

        #endregion
        #region Segment Attributes

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route calculation state.
        ///
        ///              The type of the value of the attribute is an enum CalculationState
        /// </summary>
        public const string RTE_SEGMENT_CALCULATION_STATE = "SegmentCalcState";        

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the segment name. Segment names
        ///              default to "Segment1", "Segment2", etc.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_SEGMENT_NAME = "SegmentName";
        #endregion




        #region Point Attributes

        /// <summary>
        ///             This constant is the ID for geometry list
        ///             attribute
        /// </summary>
        public const string POINT_GEOMETRIES = "PtGeometries";

        /// <summary>
        /// Point Geometries
        /// </summary>
        public const string RTE_PT_GEOMETRIES = "PtGeometry";


        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point coordinate
        ///
        ///              The type of the value of the attribute is a XPLAN Core Coordinate object
        /// </summary>
        public const string RTE_POINT_COORDINATE = "Coordinate";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point elevation
        ///
        ///              The type of the value of the attribute is a System.Double
        /// </summary>
        public const string RTE_POINT_ELEVATION = "Elevation";

        /// <summary>
        ///               This constant is the ID of a route attribute.
        ///               
        ///               The value of the attribute is the point depth.
        ///               
        ///               The type of the value of the attribute is an XPLAN Core Depth object.               
        /// </summary>
        public const string RTE_POINT_DEPTH = "Depth";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point mean sea level altitude
        ///
        ///              The type of the value of the attribute is a System.Double
        /// </summary>
        public const string RTE_POINT_MSL_ALTITUDE = "MSLAltitude";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the data transfer device ID.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_DTD_ID = "DtdID";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point name fix or ID.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_NAME_FIX = "PtNameFix";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point display number
        ///              which is a string that may or may not be coercible into an
        ///              integer.  Alphanumeric DTD ID sequence numbers are stored
        ///              in the RTE_POINT_DTD_ID attribute.
        /// </summary>
        public const string RTE_POINT_NUMBER = "PtNum";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point description..
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_DESCRIPTION = "PtDesc";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point type set.
        ///
        ///              The type of the value of the attribute is a Com object
        ///              implementing IRoutePtTypeSet.
        /// </summary>
        public const string RTE_POINT_TYPES = "PtType";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point database lookup 
        ///              string.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_DB_LOOKUP = "PtDbLookup";

        
        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point category..
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_CATEGORY_NAME = "PtCategoryName";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the calc point indicator.
        ///              Set to true if the point is inserted by the calc engine.
        ///
        ///              The type of the value of the attribute is a boolean.
        /// </summary>
        public const string RTE_POINT_CALC_INSERTED = "IsCalcPt";

        /// <summary>
        ///              This constant is the ID of a route point attribute.
        ///
        ///              The value of the attribute is a bool indicating if the point is calculated
        ///
        ///              The type of the value of the attribute is a bool
        /// </summary>
        public const string RTE_POINT_CALC_STATE = "PointCalcState";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the planned altitude.
        ///
        ///              The type of the value of the attribute is an InputAltitude.
        /// </summary>
        public const string RTE_PTCMD_PLAN_ALTITUDE = "PlanAltitudeValue";


        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the magnetic variation.
        ///
        ///              The type of the value of the attribute is a <see cref="MP.Core.Geophysical.Magvar"/>
        /// </summary>
        public const string RTE_POINT_MAGVAR = "PtMagVar";

        
        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point slave variation.
        ///              This value is specified if the point has a Navaid data 
        ///              source.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (degrees)
        /// </summary>
        public const string RTE_POINT_SLAVE_VAR = "SlaveVariation"

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point navaid type.
        ///              This value is specified if the point has a Navaid data 
        ///              source.
        ///
        ///              The type of the value of the attribute is a character.
        /// </summary>
        public const string RTE_POINT_NAVAID_TYPE = "NavaidType";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point navaid channel.
        ///
        ///              The type of the value of the attribute is a string.
        /// </summary>
        public const string RTE_POINT_NAVAID_CHANNEL = "PtNavaidChannel";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the point navaid frequency.
        ///
        ///              The type of the value of the attribute is a string.
        /// </summary>
        public const string RTE_POINT_NAVAID_FREQUENCY = "PtNavaidFrequency";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the route point remark.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_REMARK = "PtRemark1";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the runway ID.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_POINT_RUNWAY_ID = "PtRunwayID";

        /// <summary>This constant is the ID of a route attribute.
        ///              The value of the attribute is the runway Mag Heading.
        ///              The type of the value of the attribute is a System.Double.
        /// </summary>
        public const string RTE_POINT_RUNWAY_MAG_HEADING = "PtRunwayMagHeading";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded cruise wind 
        ///              magnitude and direction.
        ///
        ///              The type of the value of the attribute is a True Wind. 
        /// </summary>
        public const string RTE_LEGCMD_CRUISE_WIND = "CruiseWind";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded cruise FPM mode.
        ///
        ///              The type of the value of the attribute is an MP.Vehicle.InputList
        /// </summary>
        public const string RTE_LEGCMD_CRUISE_FPM = "FPMCruise";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded descent FPM mode.
        ///
        ///              The type of the value of the attribute is a MP.Vehicle.InputList
        /// </summary>
        public const string RTE_LEGCMD_DESCENT_FPM = "FPMDescent";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded climb FPM mode.
        ///
        ///              The type of the value of the attribute is a MP.Vehicle.InputList
        /// </summary>
        public const string RTE_LEGCMD_CLIMB_FPM = "FPMClimb";



        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded descent style.
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration ClimbDescentStyle.
        /// </summary>
        public const string RTE_LEGCMD_DESCENT_STYLE = "DescentStyle";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded climb style.
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration ClimbDescentStyle.
        /// </summary>
        public const string RTE_LEGCMD_CLIMB_STYLE = "ClimbStyle";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded climb/descent wind 
        ///              magnitude and direction.
        ///
        ///              The type of the value of the attribute is a TrueWind. 
        /// </summary>
        public const string RTE_LEGCMD_CD_WIND = "ClimbDescentWind";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the commanded airspeed.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (knots)
        /// </summary>
        public const string RTE_LEGCMD_ASPD = "AirspeedValue";


        /// <summary>
        ///              This constant is the ID of a segment attribute.
        ///
        ///              The value of the attribute is the emergency safe altitude
        ///              (MSL).
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (feet)
        /// </summary>
        public const string RTE_PTCMD_ESA = "EmergencySafeAltitude";        

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the turn data 
        ///
        ///              The type of the value of the attribute is a InputTurn
        /// </summary>
        public const string RTE_PTCMD_TURN_DATA = "TurnData";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the actual temperature.
        ///              Set to standard day temperature when commanded altitude
        ///              is set. User may specify a different value.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (degC)
        /// </summary>
        public const string RTE_PTCMD_ACTUAL_TEMPERATURE = "PointTemperatureValue";


        /// <summary>
        /// Event Indicators for display
        /// </summary>
        public const string RTE_PTCMD_EVENT_INDICATORS = "EventIndicators";

        #endregion
        #region Vehicle Attributes

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the vehicle tail number.
        ///
        ///              The type of the value of the attribute is a System.Double.
        /// </summary>
        public const string RTE_VEHICLE_TAIL_NUMBER = "TailNum";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the vehicle call sign.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_VEHICLE_CALLSIGN = "CallSign";

       
        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the vehicle minimum fuel.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (pounds)
        /// </summary>
        public const string RTE_VEHICLE_MIN_FUEL = "MinFuel";

       
        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the vehicle remark.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_VEHICLE_REMARK = "VehicleRemark";

        /// <summary>
        ///              Attribute ID for Total weight collection for vehicle
        /// </summary>
        public const string VEHICLE_CONFIGURATION_WEIGHT_TOTALIZER = "WeightTotalizer";

        /// <summary>
        ///              Attribute ID for Total drag collection for vehicle
        /// </summary>
        public const string VEHICLE_CONFIGURATION_DRAG_TOTALIZER = "DragTotalizer";

 

        #endregion

        #region STTO Attributes

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is STTO runway magnetic heading.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (degrees)
        /// </summary>
        public const string RteSTTOMagHeading = "STTOMagHeading";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is fuel used for takeoff.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (seconds)
        /// </summary>
        public const string RteSTTOFuel = "STTOFuel";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is time used for takeoff.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (seconds)
        /// </summary>
        public const string RteSTTOTime = "STTOTime";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is distance used for takeoff.
        ///
        ///              The type of the value of the attribute is a Length.
        /// </summary>
        public const string RteSTTODistance = "STTODistance";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the STTO climb out altitude.
        ///
        ///              The type of the value of the attribute is an InputAltitude.
        /// </summary>
        /// <remarks>Value's default should be saved in AGL units</remarks>
        public const string RteSTTOClimbAlt = "STTOClimbOutAltitudeValue";

        #endregion

        #region Hover command/event Attributes

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the command name. This name
        ///              correlates to the Name in the RouteCommands database table.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_COMMAND_NAME = "CmdName";

        /// <summary>
        ///              Command starting time or completion time option
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration TOTClockOptionType.
        /// </summary>
        public const string RTE_COMMAND_CLOCK_OPTION = "CmdClockOption";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the state of the
        ///              commanded clock at a point.
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration ClockStateEnum.
        /// </summary>
        public const string RTE_COMMAND_CLOCK_STATE = "CmdClockState";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is commanded clock time.
        ///
        ///              The type of the value of the attribute is a System.Double.
        ///              (seconds)
        /// </summary>
        public const string RTE_COMMAND_CLOCK_TIME = "CmdClockTime";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is command remarks.
        ///
        ///              The type of the value of the attribute is a System.String.
        /// </summary>
        public const string RTE_COMMAND_REMARKS = "CmdRemark";

        /// <summary>
        /// This constant is the ID of the delta non fuel weight attribute.
        /// The delta non fuel weight attribute contains 0 to many non fuel 
        /// weight changes as defined for the vehicle.
        /// </summary>
        public const string RteCommandDeltaNonFuelWeight = "DeltaNonFuelWeight";

        /// <summary>
        /// This constant is the ID of the delta drag attribute.
        /// The delta drag attribute contains 0 to many drag 
        /// changes as defined for the vehicle.
        /// </summary>
        public const string RteCommandDeltaDrag = "DeltaDrag";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is manual or automatic time
        ///              indicator. If manual, a time value is specified in another
        ///              attribute specific to the command type.
        ///              If automatic, the time is a computed by the system
        ///              based on specified clock times at route points.
        ///
        ///              The type of the value of the attribute is an long for
        ///              the enumeration TimingTypeEnum.
        /// </summary>
        public const string RTE_COMMAND_TIMING_TYPE = "CmdTimingType";

        /// <summary>
        /// This constant is the ID of the delta drag attribute.
        /// The delta fuel weight attribute contains 0 to many fuel 
        /// changes as defined for the vehicle.
        /// </summary>
        public const string RteCommandDeltaFuel = "DeltaFuel";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is flag where true indicates
        ///              that delta fuel is allowed.
        /// </summary>
        public const string RTE_COMMAND_DELTA_FUEL_ALLOWED = "IsDeltaFuelAllowed";

 

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///              The value of the attribute is manually specified hover 
        ///              event time.
        ///              The type of the value of the attribute is a TimeDelta.
        /// </summary>
        public const string RTE_HOVER_EVENT_TIME = "HoverManualEventTime";


        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the hover FPM
        ///              mode, category, and input list.
        ///
        ///              The type of the value of the attribute is Hover Inputs.
        /// </summary>
        public const string RTE_HOVER_FPM_EVENT = "HoverFPMEvent";


        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is hover wind 
        ///              magnitude.
        ///
        ///              The type of the value of the attribute is a System.Double. 
        ///              (knots)
        /// </summary>
        public const string RTE_HOVER_WIND = "HoverWind";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is the hover temperature.
        ///
        ///              The type of the value of the attribute is a MP.Core.Units.Temperature.
        ///              (degC)
        /// </summary>
        public const string RTE_HOVER_TEMPERATURE = "HoverTemperature";

        
        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is hover pressure altitude. 
        ///
        ///              The type of the value of the attribute is a boolean.
        /// </summary>
        public const string RTE_HOVER_ALT = "HoverPressureAltitude";

        

       

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///              The value of the attribute is event hover height. 
        ///              The type of the value of the attribute is a Length.
        /// </summary>
        public const string RTE_HOVER_HEIGHT_EVENT = "HoverHeightEvent";        

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is hover true 
        ///              coure.
        ///
        ///              The type of the value of the attribute is a System.Double. 
        ///              (degrees)
        /// </summary>
        public const string RTE_HOVER_TRUE_COURSE = "HoverTrueCourse";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is manual or automatic orbit
        ///              time indicator default - used to set CmdTimingType.
        ///              If manual, a RTE_ORBIT_TIME value is specified.
        ///              If automatic, the orbit time is a computed by the system.
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration TimingTypeEnum.
        /// </summary>
        public const string RTE_HOVER_TIMING_TYPE = "HoverTimingType";

        #endregion

        #region Calculated Point Attributes

        /// <summary>
        ///              Total distance until the end of the path.
        /// </summary>
        public const string StateRemDist = "StateRemDist";

        /// <summary>
        ///              Fuel consumed since beginning of leg.
        /// </summary>
        public const string StateLegFuel = "StateLegFuel";

        /// <summary>
        ///              Cumulative distance from beginning of leg.
        /// </summary>
        public const string StateLegDist = "StateLegDist";

        /// <summary>
        ///              NonFuel weight.
        /// </summary>
        public const string StateNonFuelWeight = "StateNonFuelWeight";

        /// <summary>
        ///              Total time until the end of the path.
        /// </summary>
        public const string StateRemTime = "StateRemTime";

        /// <summary>
        ///              Vehicle gross weight.
        /// </summary>
        public const string StateGrossWt = "StateGrossWt";

        /// <summary>
        ///              Actual MSL altitude.
        /// </summary>
        public const string StateAltitude = "StateAltitude";

        /// <summary>
        ///             Actual temperature.
        /// </summary>
        public const string StateTemp = "StateTemp";

        /// <summary>
        ///              Elapsed time from beginning of leg.
        /// </summary>
        public const string StateLegTime = "StateLegTime";

        /// <summary>
        ///              State Display Altitude of type InputAltitude.
        /// </summary>
        public const string StateDisplayAltitude = "StateDisplayAltitude";

        /// <summary>
        ///             Cumulative time consumed in the current route
        /// </summary>
        public const string StateRouteTime = "StateRouteTime";

        /// <summary>
        ///             Cumulative distance consumed in the current route
        /// </summary>
        public const string StateRouteDistance = "StateRouteDistance";

        /// <summary>
        ///              Cumulative fuel consumed in the current segment
        /// </summary>
        public const string StateSegmentFuel = "StateSegmentFuel";

        /// <summary>
        ///             Cumulative time consumed in the current segment
        /// </summary>
        public const string StateSegmentTime = "StateSegmentTime";

        /// <summary>
        ///              Cumulative distance consumed in the current segment
        /// </summary>
        public const string StateSegmentDist = "StateSegmentDist";

        /// <summary>
        ///              Bank angle used to calculate the turn parameters.
        /// </summary>
        public const string TransBankAngle = "TransBankAngle";

        /// <summary>
        ///              Equivalent turn based on calculated bank angle used
        ///              to create the transition.
        /// </summary>
        public const string TransCalculatedBankTurn = "TransCalculatedBankTurn";

        /// <summary>
        ///              Indicates climbing, cruising or descending.
        /// </summary>
        public const string TransVerticleTrend = "TransVerticleTrend";

        /// <summary>
        ///              Time in transition.
        /// </summary>
        public const string TransTime = "TransTime";

        /// <summary>
        ///              Actual calculated speed for air vehicles
        /// </summary>
        public const string TransCalculatedSpeed = "TransCalculatedSpeed";

        /// <summary>
        ///              Actual calculated speed for Ground/Maritime vehicles
        /// </summary>
        public const string TransCalculatedSpeedGM = "TransCalculatedSpeedGM";

        /// <summary>
        ///              Distance in transition.
        /// </summary>
        public const string TransDist = "TransDist";
        
        /// <summary>
        ///              Transition ground distance type (ground/air)
        /// </summary>
        public const string TransitionGrdDistType = "TransitionGrdDistType";

        /// <summary>
        ///              Distance in transition.
        /// </summary>
        public const string TransDistWithTerrain = "TransDistWithTerrain";

        /// <summary>
        ///              Distance in transition.
        /// </summary>
        public const string TransDistWithOutTerrain = "TransDistWithOutTerrain";

        /// <summary>
        ///              Magnetic course at end of transition.
        /// </summary>
        public const string TransMagCrsEnd = "TransMagCrsEnd";

        /// <summary>
        ///              Magnetic heading at the beginning of the transition.
        /// </summary>
        public const string TransMagHdgInit = "TransMagHdgInit";

        /// <summary>
        ///              Drag change (+/-).
        /// </summary>
        public const string TransDragChg = "TransDragChg";

        /// <summary>
        ///              Nonfuel weight change (+/-).
        /// </summary>
        public const string TransNonfuelWeightsChg = "TransNonfuelWeightsChg";

        /// <summary>
        ///              Simple fuel change due to onload/offload.
        /// </summary>
        public const string TransResolvedFuelChange = "TransResolvedFuelChange";

        /// <summary>
        ///              Amount of fuel change due to onload/offload.
        /// </summary>
        public const string TransFuelChange = "TransFuelChange";

        /// <summary>
        ///              Flag indicating manual modes used due to negative fuel.
        /// </summary>
        public const string TransNegFuelActive = "TransNegFuelActive";

        /// <summary>
        ///              Flag indicating that negative fuel condition reached.
        /// </summary>
        public const string TransNegFuelTrigger = "TransNegFuelTrigger";

        /// <summary>
        ///              Magnetic course at the beginning of the transition.
        /// </summary>
        public const string TransMagCrsInit = "TransMagCrsInit";

        /// <summary>
        ///              Magnetic heading at geographic mid-point of transition.
        /// </summary>
        public const string TransMagHdgMid = "TransMagHdgMid";

        /// <summary>
        ///              Fuel consumed in transition.
        /// </summary>
        public const string TransFuel = "TransFuel";

        /// <summary>
        ///              True heading at end of transition.
        /// </summary>
        public const string TransTrueHdgEnd = "TransTrueHdgEnd";

        /// <summary>
        ///              True heading at geographic mid-point of transition.
        /// </summary>
        public const string TransTrueHdgMid = "TransTrueHdgMid";

        /// <summary>
        ///              True heading at the beginning of the transiton.
        /// </summary>
        public const string TransTrueHdgInit = "TransTrueHdgInit";

        /// <summary>
        ///              Magnetic course at geographic mid-point of transiton.
        /// </summary>
        public const string TransMagCrsMid = "TransMagCrsMid";

        /// <summary>
        ///              True course at end of transition.
        /// </summary>
        public const string TransTrueCrsEnd = "TransTrueCrsEnd";

        /// <summary>
        ///              True course at geographic mid-point of transition.
        /// </summary>
        public const string TransTrueCrsMid = "TransTrueCrsMid";

        /// <summary>
        ///              True course at the beginning of the transition.
        /// </summary>
        public const string TransTrueCrsInit = "TransTrueCrsInit";

        /// <summary>
        ///              Average fuel flow.
        /// </summary>
        public const string TransFuelFlow = "TransFuelFlow";

        /// <summary>
        ///              Burn Rate.
        /// </summary>
        public const string TransBurnRate = "TransBurnRate";

        /// <summary>
        ///              Magnetic heading at end of transition.
        /// </summary>
        public const string TransMagHdgEnd = "TransMagHdgEnd";

        /// <summary>
        ///              This will identify the type of the transition.
        ///
        ///              The type of the value of the attribute is an integer for
        ///              the enumeration TransTypeEnum.
        /// </summary>
        public const string TransType = "TransType";

        /// <summary>
        ///              This will identify VPM mode used in the calculation
        ///              If no VPM was used the value will be "Manual"
        /// </summary>
        public const string TransVPMModeUsed = "TransVPMModeUsed";

        /// <summary>
        ///              Acceleration factor for a speed change
        /// </summary>
        public const string TransAccelerationFactor = "TransAccelerationFactor";

        /// <summary>
        ///              Speed change time adjustment
        /// </summary>
        public const string TransTimeAdjust = "TransTimeAdjust";

        /// <summary>
        ///              Navigation course inbound radial to leg start point
        ///              adjusted for slave variation.  Only valid if leg start
        ///              point is a VOR with published slave variation.
        /// </summary>
        public const string TransNavCourseLegStartPtInbound = "TransNavCourseLegStartPtInbound";

        /// <summary>
        ///              Navigation course outbound radial from leg start point
        ///              adjusted for slave variation.  Only valid if leg start
        ///              point is a VOR with published slave variation.
        /// </summary>
        public const string TransNavCourseLegStartPtOutbound = "TransNavCourseLegStartPtOutbound";

        /// <summary>
        ///              Navigation course inbound radial to leg end point
        ///              adjusted for slave variation.  Only valid if leg end
        ///              point is a VOR with published slave variation.
        /// </summary>
        public const string TransNavCourseLegEndPtInbound = "TransNavCourseLegEndPtInbound";

        /// <summary>
        ///              Navigation course outbound radial from leg end point
        ///              adjusted for slave variation.  Only valid if leg end
        ///              point is a VOR with published slave variation.
        /// </summary>
        public const string TransNavCourseLegEndPtOutbound = "TransNavCourseLegEndPtOutbound";

        /// <summary>
        ///              This constant is the ID of the FPM output list 
        ///              that was generated for this Transition. This attribute 
        ///              may not be set if there is no FPM computation for the 
        ///              Transition. QueryInterface to find out what kind of 
        ///              list this is (Climb, Cruise or Descent). 
        /// </summary>
        public const string TransFPMOutputList = "TransFPMOutputList";

        /// <summary>
        ///              This constant is the ID of the Hover Arrival FPM output 
        ///              list.This attribute will only be set if there was a Hover 
        ///              Command associated with this Transition. 
        /// </summary>
        public const string TransFPMArrivalOutputList = "TransFPMArrivalOutputList";

        /// <summary>
        ///              This constant is the ID of the Hover Departure FPM output 
        ///              list.This attribute will only be set if there was a Hover 
        ///              Command associated with this Transition. 
        /// </summary>
        public const string TransFPMDepartureOutputList = "TransFPMDepartureOutputList";

        /// <summary>
        ///             Transition head wind component in feet/second.
        /// </summary>
        public const string TransHeadWindComponent = "TransHeadWindComponent";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is transition wind 
        ///              magnitude.
        ///
        ///              The type of the value of the attribute is a System.Double. 
        ///              (fps)
        /// </summary>
        public const string TransWind = "TransWind";

        /// <summary>
        ///              This constant is the ID of a route attribute.
        ///
        ///              The value of the attribute is transition true current for maritime vehicles.
        /// </summary>
        public const string TransTrueCurrent = "TransTrueCurrent";

        /// <summary>
        ///              This constant is the ID of a route attribute. 
        /// 
        ///              The value of the attribute is crab angle. 
        ///              
        /// 
        ///              The type of the value of the attribute is a System.Double. 
        ///              (degree) "+" Right "-" Left 
        /// </summary>
        public const string TransCrabAngleInit = "TransCrabAngleInit";

        /// <summary>
        ///              This constant is the ID of a route attribute. 
        /// 
        ///              The value of the attribute is crab angle. 
        ///              
        /// 
        ///              The type of the value of the attribute is a System.Double. 
        ///              (degree) "+" Right "-" Left 
        /// </summary>
        public const string TransCrabAngleMid = "TransCrabAngleMid";

        /// <summary>
        ///              This constant is the ID of a route attribute. 
        /// 
        ///              The value of the attribute is crab angle. 
        ///              
        /// 
        ///              The type of the value of the attribute is a System.Double. 
        ///              (degree) "+" Right "-" Left 
        /// </summary>
        public const string TransCrabAngleEnd = "TransCrabAngleEnd";

        /// <summary>
        ///              Magnetic course at end of the leg.
        /// </summary>
        public const string TransLegMagCrsEnd = "TransLegMagCrsEnd";

        /// <summary>
        ///              Magnetic heading at the beginning of the leg.
        /// </summary>
        public const string TransLegMagHdgInit = "TransLegMagHdgInit";

        /// <summary>
        ///              Magnetic course at the beginning of the leg.
        /// </summary>
        public const string TransLegMagCrsInit = "TransLegMagCrsInit";

        /// <summary>
        ///              Magnetic heading at geographic mid-point of the leg.
        /// </summary>
        public const string TransLegMagHdgMid = "TransLegMagHdgMid";

        /// <summary>
        ///              True heading at end of the leg.
        /// </summary>
        public const string TransLegTrueHdgEnd = "TransLegTrueHdgEnd";

        /// <summary>
        ///              True heading at geographic mid-point of the leg.
        /// </summary>
        public const string TransLegTrueHdgMid = "TransLegTrueHdgMid";

        /// <summary>
        ///              True heading at the beginning of the leg.
        /// </summary>
        public const string TransLegTrueHdgInit = "TransLegTrueHdgInit";

        /// <summary>
        ///              Magnetic course at geographic mid-point of the leg.
        /// </summary>
        public const string TransLegMagCrsMid = "TransLegMagCrsMid";

        /// <summary>
        ///              True course at end of the leg.
        /// </summary>
        public const string TransLegTrueCrsEnd = "TransLegTrueCrsEnd";

        /// <summary>
        ///              True course at geographic mid-point of the leg.
        /// </summary>
        public const string TransLegTrueCrsMid = "TransLegTrueCrsMid";

        /// <summary>
        ///              True course at the beginning of the leg.
        /// </summary>
        public const string TransLegTrueCrsInit = "TransLegTrueCrsInit";

        /// <summary>
        ///              Magnetic heading at end of the leg.
        /// </summary>
        public const string TransLegMagHdgEnd = "TransLegMagHdgEnd";

        /// <summary>
        ///             Flag indicating that the calc engine that created this 
        ///             transition supports speed adjust
        /// </summary>
        public const string TransSpeedAdjustSupported = "TransSpeedAdjustSupported";

        /// <summary>
        ///             Flag indicating manual mode FPM selected and used to 
        ///             compute this transition.
        /// </summary>
        public const string TransManualModeFlag = "TransManualModeFlag";

        /// <summary>
        ///              Actual calculated speed used in FOB calculation.
        /// </summary>
        public const string TransFOBCalculatedSpeed = "TransFOBCalculatedSpeed";

        /// <summary>
        ///             Flag indicating that the transition was created by the 
        ///             previous leg.
        /// </summary>
        public const string TransCreatedByPrevLeg = "TransCreatedByPrevLeg";

        /// <summary>
        ///              Transition Creator Type (point or leg calc engine)
        /// </summary>
        public const string TransCreatorType = "TransCreatorType";

        /// <summary>
        ///              Calc Geometry Object (contains combination of points, lines, and/or arcs)
        /// </summary>
        public const string TransGeometryObject = "TransGeometryObject";

        /// <summary>
        ///              Transition Creating Command RTE ID 
        /// </summary>
        public const string TransCreatingCmdRTEID = "TransCreatingCmdRTEID";

        /// <summary>
        ///              Actual hover height for rotary wing delay arrival phase
        /// </summary>
        public const string TransHoverHeightArrival = "TransHoverHeightArrival";

        /// <summary>
        ///              Actual hover height for rotary wing delay event phase
        /// </summary>
        public const string TransHoverHeightEvent = "TransHoverHeightEvent";

        /// <summary>
        ///              Actual hover height for rotary wing delay departure phase
        /// </summary>
        public const string TransHoverHeightDeparture = "TransHoverHeightDeparture";

        /// <summary>
        ///              Actual hover duration for rotary wing delay arrival phase
        /// </summary>
        public const string TransHoverDurationArrival = "TransHoverDurationArrival";

        /// <summary>
        ///              Actual hover duration for rotary wing delay event phase
        /// </summary>
        public const string TransHoverDurationEvent = "TransHoverDurationEvent";

        /// <summary>
        ///              Actual hover duration for rotary wing delay departure phase
        /// </summary>
        public const string TransHoverDurationDeparture = "TransHoverDurationDeparture";

        /// <summary>
        ///              Fuel burned during rotary wing delay arrival phase
        /// </summary>
        public const string TransHoverFuelArrival = "TransHoverFuelArrival";

        /// <summary>
        ///              Fuel burned during rotary wing delay event phase
        /// </summary>
        public const string TransHoverFuelEvent = "TransHoverFuelEvent";

        /// <summary>
        ///              Fuel burned during rotary wing delay departure phase
        /// </summary>
        public const string TransHoverFuelDeparture = "TransHoverFuelDeparture";

        

        /// <summary>
        ///              Actual temperature deviation.
        /// </summary>
        public const string StateTempDev = "StateTempDev";

        

        /// <summary>
        ///              Current drag.
        /// </summary>
        public const string StateDrag = "StateDrag";

        /// <summary>
        ///              Actual clock time.
        /// </summary>
        public const string StateClockTime = "StateClockTime";

        /// <summary>
        ///              End of arrival gross weight 
        /// </summary>
        public const string StateArrivalGrossWeight = "ArrivalGrossWeight";

        /// <summary>
        ///              End of event gross weight
        /// </summary>
        public const string StateEventGrossWeight = "EventGrossWeight";

        /// <summary>
        ///              End of departure gross weight
        /// </summary>
        public const string StateDepartureGrossWeight = "DepartureGrossWeight";

        /// <summary>
        ///              Flag where true indicates the clock time was overridden
        /// </summary>
        public const string StateIsClockTimeOverridden = "StateIsClockTimeOverridden";

        /// <summary>
        ///              Fuel on Board Time in seconds
        /// </summary>
        public const string StateFuelOnBoardTime = "StateFuelOnBoardTime";

        /// <summary>
        ///              Fuel Reserve Time in seconds
        /// </summary>
        public const string StateFuelReserve = "StateFuelReserve";

        /// <summary>
        ///              Amount of fuel required to complete the route from a 
        ///               given point plus revovery fuel.
        /// </summary>
        public const string StateContinuationFuel = "StateContinuationFuel";

        /// <summary>
        ///              Flag indicating manual modes used due to negative fuel. 
        /// </summary>
        public const string StateNegFuelActive = "StateNegFuelActive";

        

        /// <summary>
        ///              Cumulative fuel consumed in the current segment
        /// </summary>
        public const string StateSubSegmentFuel = "StateSubSegmentFuel";

        /// <summary>
        ///             Cumulative time consumed in the current segment
        /// </summary>
        public const string StateSubSegmentTime = "StateSubSegmentTime";

        /// <summary>
        ///              Cumulative distance consumed in the current segment
        /// </summary>
        public const string StateSubSegmentDist = "StateSubSegmentDist";

        /// <summary>
        ///              Flag to indicate the start of a new segment
        /// </summary>
        public const string StateSubSegmentStart = "StateSubSegmentStart";

        /// <summary>
        ///              Elapsed time since hack time was reset 
        /// </summary>
        public const string StateHackTime = "StateHackTime";

        /// <summary>
        ///              Average headwind from the start of the leg in feet/second.
        /// </summary>
        public const string StateLegAvgHeadWind = "StateLegAvgHeadWind";

        /// <summary>
        ///              Average headwind from the start of the segment in feet/second.
        /// </summary>
        public const string StateSegmentAvgHeadWind = "StateSegmentAvgHeadWind";

        /// <summary>
        ///              Range in feet from the INS Cross Reference Point
        ///              to the States referenced Route Point
        /// </summary>
        public const string StateINSXCheckRange = "StateINSXCheckRange";

        /// <summary>
        ///              Bearing in degrees from the INS Cross Reference Point
        ///              to the States referenced Route Point
        /// </summary>
        public const string StateINSXCheckBearing = "StateINSXCheckBearing";

        /// <summary>
        ///              Magnetic bearing in degrees from the INS Cross Reference 
        ///              Point to the States referenced Route Point
        /// </summary>
        public const string StateINSXCheckMagBearing = "StateINSXCheckMagBearing";

        /// <summary>
        ///              Vehicle depth. (Maritime vehicles only)
        /// </summary>
        public const string StateDepth = "StateDepth";

        /// <summary>
        ///              Actual AGL altitude. 
        /// </summary>
        public const string StateAltitudeAGL = "StateAltitudeAGL";

        /// <summary>
        ///              Inbound true course at the end of the transition.
        /// </summary>
        public const string StateTrueCrsEnd = "StateTrueCrsEnd";

        /// <summary>
        ///              Inbound true airspeed at the end of the transition.
        /// </summary>
        public const string StateTrueSpeedEnd = "StateTrueSpeedEnd";

        

        #endregion

        
    }
}
