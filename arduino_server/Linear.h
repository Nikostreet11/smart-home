#ifndef LINEAR_H_
#define LINEAR_H_

#include "Control.h"

class Linear : public Control
{
public:
	// static constructors
	static Linear* create(PortManager& portManager, bool active);
	static Linear* create(PortManager& portManager, bool active, String id);
	
	// destructor
	virtual ~Linear();
	
	// operations
	virtual Type getType();
	virtual String getStringType() const;
	virtual void updatePort();
	virtual bool updateFrom(SmartControl* origin);
	virtual void setDefault();

	// getters / setters
	int getMin();
	int getMax();
	void setParameters(int min, int max);
	int getValue();
	void setValue(int value);
	
private:
	// constructors
	Linear(PortManager& portManager, bool active);
	Linear(PortManager& portManager, bool active, int id);
	
	// variables
	int min;
	int max;
	int value;
};

#endif /* LINEAR_H_ */
