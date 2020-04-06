#ifndef ITEM_H_
#define ITEM_H_

#include <WString.h>
#include "PortManager.h"

class Item
{
public:
	// static constructors
	static Item* create(PortManager& portManager);
	//static Item* create(String name, String icon, PortManager& portManager);
	
	// destructor
	virtual ~Item();

	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getIcon() const;
	void setIcon(const String& icon);
	const String& getPort() const;
	void setPort(const String& port);
	bool isActive() const;
	void setActive(bool active);
	//void turnOn();
	//void turnOff();

	// static constants
	static const int MAX_ITEMS = 1024;
	
private:
	// constructor
	Item(PortManager& portManager);
	
	// static variables
	static int currentId;

	// resources
	PortManager& portManager;
	
	// variables
	int id;
	String name;
	String icon;
	String port;
	bool active;
};

#endif /* ITEM_H_ */
