#ifndef PROFILE_H_
#define PROFILE_H_

#include <SPI.h>
#include <LinkedPointerList.h>
#include "Room.h"
#include "Item.h"
#include "SmartRoom.h"
#include "IdManager.h"

class Profile
{
public:
	// static constructors
	static Profile* create(LinkedPointerList<Room>& rooms);

	// destructor
	virtual ~Profile();

	// update
	void updateSmartRooms(LinkedPointerList<Room>& rooms);

	// smart add
	bool addSmartRoom(String roomId);
	bool addSmartItem(String itemId, bool active, String roomId, String smartsetId);
	
	// smart edit
	//bool editSmartRoom(String roomId, Room* newRoom);
	//bool editSmartItem(String itemId, Item* newItem);
	
	// smart remove
	bool removeSmartRoom(String roomId);
	//bool removeSmartItem(String itemId, String roomId);

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getAvatar() const;
	void setAvatar(const String& avatar);
	SmartRoom* getSmartRoom(int index);
	SmartRoom* getSmartRoom(const String& roomId);
	int getSmartRoomIndex(const String& roomId);
	int getSmartRoomsSize();

	// static constants
	static const int MAX_PROFILES = 32;
	
private:
	// constructor
	explicit Profile(LinkedPointerList<Room>& rooms);

	// static resources
    static IdManager idManager;
	
	// static variables
	//static int currentId;
	
	// resources
	LinkedPointerList<SmartRoom> smartRooms;

	// variables
	int id;
	String name;
	String avatar;
};

#endif /* PROFILE_H_ */
