#ifndef ROOM_H_
#define ROOM_H_

#include <LinkedPointerList.h> // linked list library
#include "Item.h"
#include "Smartset.h"

class Room
{
public:
	// static constructors
	static Room* create();
	//explicit Room(String name, String icon);
	// destructor
	virtual ~Room();

	// search
	/*Item* searchItem(const String& id);
	int searchItemIndex(const String& id);*/

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getIcon() const;
	void setIcon(const String& icon);
	//bool isSmart() const;
	//void setSmart(bool smart);
	Item* get(int index);
	Smartset* getSmartset(int index);
	Item* get(const String& id);
	Smartset* getSmartset(const String& id);
	int getIndex(const String& id);
	int getSmartsetIndex(const String& id);
	bool add(Item* item);
	bool addSmartset(Smartset* smartset);
	bool remove(int index);
	bool removeSmartset(int index);
	int getSize();
	int getSmartsetsSize();

	// static constants
	static const int MAX_ROOMS = 1024;
	static const int MAX_ITEMS = 8;
	
private:
	// constructors
	Room();
	
	// static variables
	static int currentId;

	// resources
	LinkedPointerList<Item> items;
	LinkedPointerList<Smartset> smartsets;
	
	// variables
	int id;
	String name;
	String icon;
	// bool smart;
};

#endif /* ROOM_H_ */
