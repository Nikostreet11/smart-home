#ifndef PROFILE_H_
#define PROFILE_H_

#include <SPI.h>
#include <LinkedPointerList.h>
#include <TimeLib.h>
#include "Room.h"
#include "Item.h"
#include "SmartRoom.h"
#include "IdManager.h"

class Profile
{
public:
	// static constructors
	static Profile* create(LinkedPointerList<Room>& rooms);
	static Profile* create(LinkedPointerList<Room>& rooms, String id);

	// destructor
	virtual ~Profile();

	// operations
	bool addSmartRoom(String roomId);
	bool removeSmartRoom(int index);

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getAvatar() const;
	void setAvatar(const String& avatar);
	unsigned long getLastEdit();
	void setLastEdit(unsigned long lastEdit);
	SmartRoom* getSmartRoom(int index);
	SmartRoom* getSmartRoom(const String& roomId);
	int getSmartRoomIndex(const String& roomId);
	int getSmartRoomsSize();

	// static constants
	static const int MAX_PROFILES = 8;
	
private:
	// internal
	static int toTrueId(String id);
	
	// constructor
	explicit Profile(LinkedPointerList<Room>& rooms);
	explicit Profile(LinkedPointerList<Room>& rooms, int id);

	// static resources
    static IdManager idManager;
	
	// resources
	LinkedPointerList<SmartRoom> smartRooms;

	// variables
	int id;
	String name;
	String avatar;
	unsigned long lastEdit;
};

#endif /* PROFILE_H_ */
