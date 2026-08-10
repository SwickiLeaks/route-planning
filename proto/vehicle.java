package umirpc;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import mp.core.serialization.CrossPlatformSerializer;
import msnsvr.MsnSvrOuterClass;
import umi.enums.CalculationStatus;
import umi.enums.ModelType;
import umi.enums.PointUsageType;
import umi.enums.TransactionAction;
import umi.interfaces.IRouteModel;
import umirpc.interfaces.IMsnSvrClient;
import umirpc.requests.AttributeRequestHelper;

public class Samples {
    private static final Logger logger = Logger.getLogger("CPMS UMI Samples");
    static int _timeout = 5000;

    static final public String PropertyPrefix = "PropertyInfo";

    /***
     * ID of the active mission
     */
    String _activeMissionId = "";

    /***
     * ID of the current mission
     */
    String _currentMissionId;

    /***
     * ID of the current route
     */
    String _currentRouteId;

    /***
     * ID of the current segment
     */
    String _currentSegmentId;

    /***
     * ID of the current segment
     */
    String _currentVehicleId;

    msnsvr.MsnSvrOuterClass.CallId _callerId = null;

    IMsnSvrClient getRpcClient() {
        // To DO: return the client
        return null;
    }

    /***
     * Retrieves information about the caller
     */
    MsnSvrOuterClass.CallId getCallId()
    {
        if(_callerId == null)
            _callerId = msnsvr.MsnSvrOuterClass.CallId.getDefaultInstance();
        return _callerId;
    }


    /***
     * Creates a new transaction to edit a mission. This call must always be followed by endTransaction
     */
    void startTransaction(String missionID, String description) {
        IMsnSvrClient client = getRpcClient();

        // start transaction
        MsnSvrOuterClass.TransactionRequest.Builder trBuilder = MsnSvrOuterClass.TransactionRequest.newBuilder();
        trBuilder.setCaller(
                        MsnSvrOuterClass.CallId.newBuilder()
                                .mergeFrom(getCallId())
                                .build())
                .setMissionId(missionID)
                .setName(description)
                .setRequestType(TransactionAction.Start.ordinal())
                .setTimeoutMill(_timeout);
        MsnSvrOuterClass.TransactionResponse response = client.TransactionData(trBuilder.build());

        // store the transaction ID in the caller ID
        if(response != null) {
            _activeMissionId = missionID;

            MsnSvrOuterClass.CallId.Builder callBuilder = MsnSvrOuterClass.CallId.newBuilder()
                    .mergeFrom(_callerId)
                    .setTransactionId(
                            response.getCaller().getTransactionId()
                    );
            _callerId = callBuilder.build();
        }
    }

    /***
     * Ends a transaction. This call must always be proceeded by startTransaction
     */
    void endTransaction() {
        IMsnSvrClient client = getRpcClient();

        // start transaction
        MsnSvrOuterClass.TransactionRequest.Builder trBuilder = MsnSvrOuterClass.TransactionRequest.newBuilder();
        trBuilder.setCaller(
                        MsnSvrOuterClass.CallId.newBuilder()
                                .mergeFrom(getCallId())
                                .build())
                .setMissionId(_activeMissionId)
                .setName("")
                .setRequestType(2)
                .setTimeoutMill(_timeout);
        MsnSvrOuterClass.TransactionResponse response = client.TransactionData(trBuilder.build());

        // remove the transaction ID from the caller ID
        if(response != null) {
            _activeMissionId = "";

            MsnSvrOuterClass.CallId.Builder callBuilder = MsnSvrOuterClass.CallId.newBuilder()
                    .mergeFrom(_callerId)
                    .setTransactionId("");
            _callerId = callBuilder.build();
        }
    }

    String addMission(){
        // start transaction
        startTransaction("", "Add mission");

        // add mission
        MsnSvrOuterClass.ChildRequest.Builder crBuilder = MsnSvrOuterClass.ChildRequest.newBuilder();

        // Build child request
        crBuilder.setClient(getCallId())
                .setParent(getParentIdForMissions())
                .setChild(
                        MsnSvrOuterClass.ChildId.newBuilder()
                                .setType(ModelType.Mission.ordinal())
                                .setId("")
                                .setIndex(0) // first mission
                                .build()
                );
        MsnSvrOuterClass.ChildInfo response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.AddChild(crBuilder.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        // end transaction
        endTransaction();

        if(response != null)
        {   // return the mission ID
            _currentMissionId = response.getId();
        }
        return _currentMissionId;
    }

    String addRoute(String missionId){
        // start transaction
        startTransaction(_currentMissionId, "Add route");

        // add mission
        MsnSvrOuterClass.ChildRequest.Builder crBuilder = MsnSvrOuterClass.ChildRequest.newBuilder();

        // Build child request
        crBuilder.setClient(getCallId())
                .setParent(getMissionAsParentId(missionId))
                .setChild(
                        MsnSvrOuterClass.ChildId.newBuilder()
                                .setType(ModelType.Route.ordinal())
                                .setId("")
                                .setIndex(0) // first route at index 0
                                .build()
                );
        MsnSvrOuterClass.ChildInfo response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.AddChild(crBuilder.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        // end transaction
        endTransaction();

        if(response != null)
        {
            // return the mission ID
            _currentRouteId = response.getId();
            _currentVehicleId = null;
            _currentSegmentId = null;
            getSegmentId(_currentMissionId, _currentRouteId);
            getVehicleId();
        }
        return _currentRouteId;
    }

    String getSegmentId(String missionId, String routeId){

        // Build child request
        MsnSvrOuterClass.ChildRequest.Builder bldr = MsnSvrOuterClass.ChildRequest.newBuilder();
        bldr.setClient(getCallId())
                .setParent(getRouteAsParentId(missionId, routeId))
                .setChild(MsnSvrOuterClass.ChildId.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .build()
                );
        MsnSvrOuterClass.ChildInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetChildrenInfo(bldr.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        if(response != null)
        {
            List<MsnSvrOuterClass.ChildInfo> children = response.getObjectsList();

            if(children.size() > 0) {
                // return the mission ID
                _currentSegmentId = children.get(0).getId();
            }
        }
        return _currentSegmentId;
    }

    String getVehicleId(){

        // Build child request
        MsnSvrOuterClass.ChildRequest.Builder bldr = MsnSvrOuterClass.ChildRequest.newBuilder();
        bldr.setClient(getCallId())
                .setParent(getSegmentAsParentId())
                .setChild(MsnSvrOuterClass.ChildId.newBuilder()
                        .setType(ModelType.Vehicle.ordinal())
                        .build()
                );
        MsnSvrOuterClass.ChildInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetChildrenInfo(bldr.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        if(response != null)
        {
            List<MsnSvrOuterClass.ChildInfo> children = response.getObjectsList();

            if(children.size() > 0) {
                // return the mission ID
                _currentVehicleId = children.get(0).getId();
            }
        }
        return _currentVehicleId;
    }

    String addPointToCurrentRoute() {

        // Build child request
        MsnSvrOuterClass.ChildRequest.Builder crBuilder = MsnSvrOuterClass.ChildRequest.newBuilder();
        crBuilder.setClient(getCallId())
                .setParent(getSegmentAsParentId())
                .setChild(MsnSvrOuterClass.ChildId.newBuilder()
                        .setType(ModelType.RoutePoint.ordinal())
                        .build()
                );
        MsnSvrOuterClass.ChildInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetChildrenInfo(crBuilder.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        int numChildren = 0;
        if(response != null)
        {
            numChildren = response.getObjectsCount();
        }

        return insertPointToCurrentRoute(numChildren);
    }

    /***
     * Inserts a point into a route segment at the supplied index in the point list
     * @param index Index to insert point. Zero indicates beginning of route.
     * @return ID of the inserted point
     */
    String insertPointToCurrentRoute(int index){
        String newPointId = "";

        // start transaction
        startTransaction(_currentMissionId, "Add route point");

        // add mission
        MsnSvrOuterClass.ChildRequest.Builder crBuilder = MsnSvrOuterClass.ChildRequest.newBuilder();

        // Build child request
        crBuilder.setClient(getCallId())
                .setParent(getSegmentAsParentId())
                .setChild(
                        MsnSvrOuterClass.ChildId.newBuilder()
                                .setType(ModelType.RoutePoint.ordinal())
                                .setId("")
                                .setIndex(index) // first route at index 0
                                .build()
                );
        MsnSvrOuterClass.ChildInfo response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.AddChild(crBuilder.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        // end transaction
        endTransaction();

        if(response != null)
        {
            // return the mission ID
            newPointId = response.getId();
        }
        return newPointId;
    }

    /***
     * Sets an attribute's value on a route point.
     * @param pointId ID of the point to modify
     * @param attributeId ID of the attribute to modify
     * @param attributeType Data type of the attribute
     * @param attributeValue Value of the attribute
     */
    void setPointAttribute(String pointId, String attributeId, String attributeType, String attributeValue){
        // start transaction
        startTransaction(_currentMissionId, "Set point " + attributeId);

        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getPointId(pointId),
                attributeId, attributeType, attributeValue);

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.SetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to set data - ", e);
        }

        // end transaction
        endTransaction();

        if(response != null)
        {
            // success
        }
    }

    /***
     * Sets an attribute's value on a route point.
     * @param pointId ID of the point to modify
     * @param attributeId ID of the attribute to modify
     * @param attributeType Data type of the attribute
     * @param attributeValue Value of the attribute
     */
    void setEventAttribute(String pointId, String eventId, String attributeId, String attributeType, String attributeValue){
        // start transaction
        startTransaction(_currentMissionId, "Set point " + attributeId);

        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getEventId(pointId, eventId),
                attributeId, attributeType, attributeValue);

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.SetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to set data - ", e);
        }

        // end transaction
        endTransaction();

        if(response != null)
        {
            // success
        }
    }

    void setPointAltitude(String pointId, String altitude){
        // e.g. "500 A" for agl and "5000 M" for MSL
        setPointAttribute(pointId, "PlanAltitudeValue" , "MP.Core.Weather.InputAltitude", altitude);
    }

    void setPointSpeed(String pointId, String speed){
        // e.g. "100 T" for true speed and "110 C" for calibrated speed
        setPointAttribute(pointId, "AirspeedValue" , "MP.Vehicle.InputSpeed", speed);
    }

    void setPointCoordinate(String pointId, String coordinate ){
        // e.g. "N 33 10.00/W 95 30.00"
        setPointAttribute(pointId, "Coordinate" , "MP.Core.Navigation.Coordinate", coordinate);
    }

    public void setPointTypeToHover(String pointId) {
        setPointAttribute(pointId,PropertyPrefix + "PointType", "MP.MissionEditor.PointUsageType", "RotaryWingDelay");
    }

    public void setPointTypeToNormalTurn(String pointId) {
        setPointAttribute(pointId,PropertyPrefix + "PointType", "MP.MissionEditor.PointUsageType", "Turn");
    }

    public void setHoverDuration(String pointId, String hoverEventId, String duration) {
        // e.g. 5 minutes would be:  00+05+00
        setEventAttribute(pointId,hoverEventId, PropertyPrefix + "Time", "MP.Core.Units.TimeDelta", duration);
    }

    public void setHoverHeight(String pointId, String hoverEventId, String heightAgl) {
        // e.g. 50 feet would be: 50A
        setEventAttribute(pointId, hoverEventId,"HoverHeightEvent", "MP.Core.Weather.AltitudeAGL", heightAgl);
    }

    String getCalculatedPointId(String pointId){
        // Build child request
        MsnSvrOuterClass.ChildRequest.Builder bldr = MsnSvrOuterClass.ChildRequest.newBuilder();
        bldr.setClient(getCallId())
                .setParent(getCalculatedPointCollectionId(pointId))
                .setChild(MsnSvrOuterClass.ChildId.newBuilder()
                        .setType(ModelType.CalculatedPoint.ordinal())
                        .build()
                );
        MsnSvrOuterClass.ChildInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetChildrenInfo(bldr.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        String calculatedPointId = "";
        if(response != null)
        {
            List<MsnSvrOuterClass.ChildInfo> children = response.getObjectsList();
            // the last calculated point contains the data.
            if(children.size() > 0) {
                // return the ID
                calculatedPointId = children.get(children.size()-1).getId();
            }
        }
        return calculatedPointId;
    }

    /***
     * @param pointId ID of point whose event to retrieve
     * @return Event ID
     */
    String getEventtId(String pointId){

        // Build child request
        MsnSvrOuterClass.ChildRequest.Builder bldr = MsnSvrOuterClass.ChildRequest.newBuilder();
        bldr.setClient(getCallId())
                .setParent(getEventCollectionId(pointId))
                .setChild(MsnSvrOuterClass.ChildId.newBuilder()
                        .setType(ModelType.Event.ordinal())
                        .build()
                );
        MsnSvrOuterClass.ChildInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetChildrenInfo(bldr.build());
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to add child - ", e);
        }

        String eventId = "";
        if(response != null)
        {
            List<MsnSvrOuterClass.ChildInfo> children = response.getObjectsList();
            // the first event contains the data.
            if(children.size() > 0) {
                // return the ID
                eventId = children.get(0).getId();
            }
        }
        return eventId;
    }

    String getSegmentCalculationState()
    {
        return getSegmentAttribute("SegmentCalcState");
    }

    public void beginCalculation() throws Exception {
        // Don't start a calculation unless
        //  the status is not calculated
        String status = getSegmentCalculationState();
        if ("Calculating".equals(status))
            return;

        // leave description blank.
        // Adding a description creates an "Undo Transaction" and calculations cannot be undone.
        startTransaction(_currentMissionId, "");

        MsnSvrOuterClass.CallId callId = MsnSvrOuterClass.CallId.newBuilder()
                .mergeFrom(_callerId)
                .setContext("Calculate")
                .build();

        MsnSvrOuterClass.AttributeRequest.Builder builder = MsnSvrOuterClass.AttributeRequest.newBuilder();
        builder.setClient(callId);
        builder.setParent(getMissionAsParentId(_currentMissionId));



        try {
            MsnSvrOuterClass.AttributeInfoList ail = getRpcClient().DoAction(builder.build());
        } catch (Exception exc) {
            mp.core.logging.Logger.error(exc);
        } finally {


        }
    }

    String getPointAttribute(String pointId, String attributeId){

        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getPointId(pointId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    String getCalcPointAttribute(String pointId, String calcPointId, String attributeId){

        // get request
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getCalculatedPointId(pointId, calcPointId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    String getEventAttribute(String pointId, String eventId, String attributeId){

        // set value
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getEventId(pointId, eventId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    String getSegmentAttribute(String attributeId){

        // get request
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getSegmentAsParentId(),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    String getVehicleAttribute(String attributeId){

        // get request
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getVehicleId(_currentSegmentId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    /***
     * Reads an attribute value
     * @param attributeId ID of the attribute to read
     * @return attribute value or null
     * @implNote Data type is removed from the value
     */
    String getRouteAttribute(String attributeId){

        // get request
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getRouteAsParentId(_currentMissionId, _currentRouteId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    String getAttributeValue(MsnSvrOuterClass.AttributeInfoList response, String attributeId)
    {
        String result = "";
        if(response != null)
        { // there should only be one entry
            for (MsnSvrOuterClass.AttributeInfo info : response.getAttributesList()) {
                if(info.getName().equals(attributeId)) {
                    result = info.getValue();
                    int valueIndex = result.indexOf(';') + 1;
                    if(valueIndex > 0 && valueIndex < result.length())
                        result = result.substring(valueIndex);
                }
            }
        }
        return result;
    }

    /***
     * Reads an attribute value
     * @param attributeId ID of the attribute to read
     * @return attribute value or null
     * @implNote Data type is removed from the value
     */
    String getMissionAttribute(String attributeId){

        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getMissionAsParentId(_currentMissionId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        return getAttributeValue(response, attributeId);
    }

    public String getHoverDuration(String pointId, String hoverEventId) {
        return getEventAttribute(pointId, hoverEventId,PropertyPrefix + "Time");
    }

    public String getHoverHeight(String pointId, String hoverEventId) {
        return getEventAttribute(pointId, hoverEventId,"HoverHeightEvent");
    }

    String getPointCoordinate(String pointId){
        return getPointAttribute(pointId, "Coordinate");
    }

    String getPointElevation(String pointId){
        return getPointAttribute(pointId, "Elevation");
    }

    /***
     * Gets name, or fix ID, of a route point
     * @param pointId ID of the point whose name to retrieve
     * @return Name or null
     */
    String getPointName(String pointId){
        return getPointAttribute(pointId, "PtNameFix");
    }

    /***
     * Gets the order of a route point in a route segment. First point is number 1.
     * @param pointId ID of the point whose number to retrieve
     * @return Number or null
     * @apiNote Number is not required to be an integer, but normally is.
     */
    String getPointNumber(String pointId){
        return getPointAttribute(pointId, "PtNum");
    }

    /***
     * Gets description of a route point
     * @param pointId ID of the point whose description to retrieve
     * @return Description or null
     */
    String getPointDescription(String pointId){
        return getPointAttribute(pointId, "PtDesc");
    }

    /***
     * Gets point type
     * @param pointId ID of the point whose point type to retrieve
     * @return Point type
     */
    public String getPointType(String pointId) {
        return getPointAttribute(pointId, PropertyPrefix + "PointType");
    }

    /***
     * Gets XPlan representation of point type
     * @param pointId ID of the point whose point type to retrieve
     * @return Point type
     */
    String getRawPointType(String pointId){
        return getPointAttribute(pointId, "PtType");
    }

    /***
     * Gets planned altitude of a route point
     * @param pointId ID of the point whose altitude to retrieve
     * @return Altitude or null
     * @implNote Calculated altitude can differ from planned altitude.
     */
    String getPointPlannedAltitude(String pointId){
        return getPointAttribute(pointId, "PlanAltitudeValue");
    }

    /***
     * Gets magnetic variation of a route point
     * @param pointId ID of the point whose altitude to retrieve
     * @return Magnetic variation or null
     */
    String getPointMagVar(String pointId){
        return getPointAttribute(pointId, "PtMagVar");
    }

    /***
     * Gets airspeed of a route point
     * @param pointId ID of the point whose altitude to retrieve
     * @return Airspeed or null
     */
    String getPointAirspeed(String pointId){
        return getPointAttribute(pointId, "AirspeedValue");
    }

    String getStartingWeight()
    {
        String xml = getVehicleAttribute("WeightTotalizer");
        return getXmlValue(xml, "<TotalVehicleWeightMass>");
    }

    String getStartingFuelWeight()
    {
        String xml = getVehicleAttribute("WeightTotalizer");
        return getXmlValue(xml, "<TotalMassFuel>");
    }

    String getStartingNonFuelWeight()
    {
        String xml = getVehicleAttribute("WeightTotalizer");
        return getXmlValue(xml, "<TotalNonFuelWeight");
    }

    private String getXmlValue(String xml, String element)
    {
        if(xml != null) {
            int beginIndex = xml.indexOf(element);
            beginIndex = xml.indexOf("<value>", beginIndex) + "<value>".length();
            int endIndex = xml.indexOf("</value>", beginIndex);
            if (endIndex > 0) {
                return xml.substring(beginIndex, endIndex);
            }
        }
        return "";
    }

    String getRouteName(){
        return getRouteAttribute( "RouteName");
    }

    String getRouteCalculationState(){
        return getRouteAttribute( "RouteCalcState");
    }

    String getCalculationMessages(){
        return getMissionAttribute( "CalcStatus");
    }

    boolean getRouteNegativeFuelCalculationFlag(){
        boolean result = false;
        String value = getRouteAttribute( "NegativeFuelCalculationFlag");
        if(value != null && !value.isEmpty())
            result = Boolean.parseBoolean(value);
        return result;
    }

    List<String> getAllAttributes(String pointId){
        List<String> attIDs = new ArrayList<>();
        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAllAttributesRequest(pointId);

        MsnSvrOuterClass.AttributeInfoList attributes = getRpcClient().DoAction(request);

        for (int i = 0; i < attributes.getAttributesCount(); i++) {
            MsnSvrOuterClass.AttributeInfo info = attributes.getAttributes(i);

            switch (info.getName()) {
                case "AttList":
                    String[] split = info.getValue().split(";");
                    for (int j = 0; j < split.length; j++) {
                        attIDs.add(split[j]);
                    }
                    break;
                default:
                    break;
            }
        }
        return attIDs;
    }

    // Helper methods

    MsnSvrOuterClass.AttributeRequest getAllAttributesRequest(String pointId) {
        MsnSvrOuterClass.CallId.Builder callIdBldr = MsnSvrOuterClass.CallId.newBuilder().mergeFrom(_callerId).setContext("AllAtts");
        MsnSvrOuterClass.AttributeRequest.Builder builder = MsnSvrOuterClass.AttributeRequest.newBuilder();
        builder.setClient(callIdBldr.build());
        builder.setParent(getPointId(pointId));
        return builder.build();
    }

    /***
     * Creates an attribute request in order to modify an attribute's value
     * @param parentId Parent ID for the object that owns the attribute
     * @param attributeId ID of the attribute
     * @param attributeType Data type of the attribute.
     * @param attributeValue Value of the attribute
     * @return New attribute request
     */
    MsnSvrOuterClass.AttributeRequest getAttributeRequest(MsnSvrOuterClass.ParentId parentId, String attributeId, String attributeType, String attributeValue) {
        MsnSvrOuterClass.AttributeRequest.Builder builder = MsnSvrOuterClass.AttributeRequest.newBuilder();
        builder.setClient(_callerId);
        builder.setParent(parentId);

        MsnSvrOuterClass.AttributeInfo.Builder aiBuilder = MsnSvrOuterClass.AttributeInfo.newBuilder();
        aiBuilder.setName(attributeId);
        if (attributeValue == null) {
            aiBuilder.setIsNull(true);
            aiBuilder.setValue("");
        }
        else {
            String assemblyName = "";
            if(attributeType.startsWith("MP.Core."))
                assemblyName = "MP.Core4, Version=4.0.0.0, Culture=neutral, PublicKeyToken=null";
            else if(attributeType.startsWith("System."))
                assemblyName = "netstandard, Version=2.0.0.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51";
            else if(attributeType.startsWith("MP.Vehicle."))
                assemblyName = "MP.Vehicle.Interfaces4, Version=4.0.0.0, Culture=neutral, PublicKeyToken=null";
            else if(attributeType.startsWith("MP.Mission.Data."))
                assemblyName = "MP.Mission.Data.Core7, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null";
            else if(attributeType.startsWith("MP.Geometry."))
                assemblyName = "MP.Geometry3, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null";
            else if(attributeType.startsWith("MP.MissionEditor"))
                assemblyName = "MP.MissionEditor7, Version=2.0.0.0, Culture=neutral, PublicKeyToken=null";
            aiBuilder.setTypeName("");
            aiBuilder.setAssemblyName("");
            aiBuilder.setValue(attributeType + ", " + assemblyName +";" + attributeValue);
        }
        builder.addAttributes( aiBuilder.build() );
        return builder.build();
    }

    /***
     * Retrieves an ID that can be used as the parentId for a mission
     * @return Parent ID
     */
    MsnSvrOuterClass.ParentId getParentIdForMissions() {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        return pidBuilder.build();
    }

    /***
     * Retrieves a mission ID as a ParentId
     * @return Parent ID
     */
    MsnSvrOuterClass.ParentId getMissionAsParentId(String missionId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(missionId)
                        .build()
        );
        return pidBuilder.build();
    }

    /***
     * Retrieves a route ID as a ParentId
     * @return Parent ID
     */
    MsnSvrOuterClass.ParentId getRouteAsParentId(String missionId, String routeId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(missionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(routeId)
                        .build()
        );
        return pidBuilder.build();
    }

    /***
     * Retrieves a segment ID as a ParentId
     * @return Parent ID
     */
    MsnSvrOuterClass.ParentId getSegmentAsParentId() {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        return pidBuilder.build();
    }

    MsnSvrOuterClass.ParentId getPointId(String pointId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.RoutePoint.ordinal())
                        .setId(pointId)
                        .build()
        );
        return pidBuilder.build();
    }

    MsnSvrOuterClass.ParentId getCalculatedPointCollectionId(String pointId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.RoutePoint.ordinal())
                        .setId(pointId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.CalculatedPointCollection.ordinal())
                        .setId(pointId)
                        .build()
        );
        return pidBuilder.build();
    }

    MsnSvrOuterClass.ParentId getCalculatedPointId(String pointId, String calcPointId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.RoutePoint.ordinal())
                        .setId(pointId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.CalculatedPointCollection.ordinal())
                        .setId(pointId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.CalculatedPoint.ordinal())
                        .setId(calcPointId)
                        .build()
        );
        return pidBuilder.build();
    }

    MsnSvrOuterClass.ParentId getEventCollectionId(String pointId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.RoutePoint.ordinal())
                        .setId(pointId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.EventCollection.ordinal())
                        .setId(pointId)
                        .build()
        );
        return pidBuilder.build();
    }

    MsnSvrOuterClass.ParentId getEventId(String pointId, String eventId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.RoutePoint.ordinal())
                        .setId(pointId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.EventCollection.ordinal())
                        .setId(pointId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Event.ordinal())
                        .setId(eventId)
                        .build()
        );
        return pidBuilder.build();
    }

    MsnSvrOuterClass.ParentId getVehicleId(String vehicleId) {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Mission.ordinal())
                        .setId(_currentMissionId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Route.ordinal())
                        .setId(_currentRouteId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Segment.ordinal())
                        .setId(_currentSegmentId)
                        .build()
        );
        pidBuilder.addIds(
                MsnSvrOuterClass.IdType.newBuilder()
                        .setType(ModelType.Vehicle.ordinal())
                        .setId(vehicleId)
                        .build()
        );

        return pidBuilder.build();
    }
}
