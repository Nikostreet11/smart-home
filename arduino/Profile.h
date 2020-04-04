#ifndef PROFILE_H_
#define PROFILE_H_

#include <SPI.h>
#include <LinkedPointerList.h>
#include "Room.h"
#include "Item.h"
#include "SmartRoom.h"

class Profile
{
public:
	// static constructors
	static Profile* create(LinkedPointerList<Room>& rooms);

	// destructor
	virtual ~Profile();

	// smart add
	bool addSmartRoom(String roomId);
	bool addSmartItem(String itemId, bool active, String roomId);
	
	// smart edit
	//bool editSmartRoom(String roomId, Room* newRoom);
	//bool editSmartItem(String itemId, Item* newItem);
	
	// smart delete
	bool deleteSmartRoom(String roomId);
	bool deleteSmartItem(String itemId, String roomId);

	// smart
	bool isItemSmart(String itemId, String roomId);
	// TODO: maybe use a status object?
	bool setItemSmart(String itemId, bool smart, bool active, String roomId);

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getAvatar() const;
	void setAvatar(const String& avatar);
	SmartRoom* getSmartRoom(const String& roomId);

	// static constants
	static const int MAX_PROFILES = 1024;
	
private:
	// constructor
	explicit Profile(LinkedPointerList<Room>& rooms);
	
	// static variables
	static int currentId;
	
	// resources
	LinkedPointerList<SmartRoom> smartRooms;

	// variables
	int id;
	String name;
	String avatar;
};

#endif /* PROFILE_H_ */
