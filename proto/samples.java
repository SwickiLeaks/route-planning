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
import umi.enums.TransactionAction;
import umi.interfaces.IRouteModel;
import umirpc.interfaces.IMsnSvrClient;
import umirpc.requests.AttributeRequestHelper;

public class Samples {
    private static final Logger logger = Logger.getLogger("CPMS UMI Samples");
    static int _timeout = 5000;
    String _activeMissionId = "";

    String _currentMissionId;
    String _currentRouteId;
    String _currentSegmentId;

    msnsvr.MsnSvrOuterClass.CallId _callerId = null;

    IMsnSvrClient getRpcClient() {
        // To DO: return the client
        return null;
    }

    MsnSvrOuterClass.CallId getCallId()
    {
        if(_callerId == null)
            _callerId = msnsvr.MsnSvrOuterClass.CallId.getDefaultInstance();
        return _callerId;
    }



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
                .setRequestType(TransactionAction.Start.ordinal())
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
        startTransaction("", "Add route");

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

            getSegmentId(_currentMissionId, _currentRouteId);
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

    String insertPointToCurrentRoute(int index){
        String newPointId = "";

        // start transaction
        startTransaction("", "Add route point");

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

    void setPointAttribute(String pointId, String attributeId, String attributeType, String attributeValue){
        // start transaction
        startTransaction("", "Set point " + attributeId);

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
     * @param pointId
     * @return Event ID
     *
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

    public void BeginCalculation() throws Exception {
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
        String result = "";
        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getPointId(pointId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        if(response != null)
        { // there should only be one entry
            for (MsnSvrOuterClass.AttributeInfo info : response.getAttributesList()) {
                if(info.getName().equals(attributeId))
                    result = info.getValue();
            }
        }
        return result;
    }

    String getCalcPointAttribute(String pointId, String calcPointId, String attributeId){
        String result = "";
        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getCalculatedPointId(pointId, calcPointId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        if(response != null)
        { // there should only be one entry
            for (MsnSvrOuterClass.AttributeInfo info : response.getAttributesList()) {
                if(info.getName().equals(attributeId))
                    result = info.getValue();
            }
        }
        return result;
    }

    String getEventAttribute(String pointId, String eventId, String attributeId){
        String result = "";
        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getEventId(pointId, eventId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        if(response != null)
        { // there should only be one entry
            for (MsnSvrOuterClass.AttributeInfo info : response.getAttributesList()) {
                if(info.getName().equals(attributeId))
                    result = info.getValue();
            }
        }
        return result;
    }

    String getSegmentAttribute(String attributeId){
        String result = "";
        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getSegmentAsParentId(),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        if(response != null)
        { // there should only be one entry
            for (MsnSvrOuterClass.AttributeInfo info : response.getAttributesList()) {
                if(info.getName().equals("Coordinate"))
                    result = info.getValue();
            }
        }
        return result;
    }

    String getRouteAttribute(String attributeId){
        String result = "";
        // set coordinate
        MsnSvrOuterClass.AttributeRequest request = getAttributeRequest(getRouteAsParentId(_currentMissionId, _currentRouteId),
                attributeId , "", "");

        MsnSvrOuterClass.AttributeInfoList response = null;
        try {
            IMsnSvrClient client = getRpcClient();
            response = client.GetAttributes(request);
        } catch (Exception e) {
            logger.log(Level.WARNING,"Add Failed to read data - ", e);
        }

        if(response != null)
        { // there should only be one entry
            for (MsnSvrOuterClass.AttributeInfo info : response.getAttributesList()) {
                if(info.getName().equals("Coordinate"))
                    result = info.getValue();
            }
        }
        return result;
    }

    String getPointCoordinate(String pointId){
        return getPointAttribute(pointId, "Coordinate");
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
            aiBuilder.setTypeName(attributeType);
            aiBuilder.setAssemblyName(assemblyName);
            aiBuilder.setValue(CrossPlatformSerializer.serialize(attributeValue));
        }
        builder.addAttributes( aiBuilder.build() );
        return builder.build();
    }

    MsnSvrOuterClass.ParentId getParentIdForMissions() {
        MsnSvrOuterClass.ParentId.Builder pidBuilder = MsnSvrOuterClass.ParentId.newBuilder();
        return pidBuilder.build();
    }

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
}
