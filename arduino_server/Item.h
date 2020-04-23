#ifndef ITEM_H_
#define ITEM_H_

#include <WString.h>
#include "PortManager.h"
#include "IdManager.h"

class Item
{
public:
	// static constructors
	static Item* create(PortManager& portManager);
	
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

	// static constants
	static const int MAX_ITEMS = 255;
	
private:
	// constructor
	Item(PortManager& portManager);

	// static resources
    static IdManager idManager;

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
