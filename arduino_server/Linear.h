#ifndef LINEAR_H_
#define LINEAR_H_

#include "Control.h"

class Linear : public Control
{
public:
	// constructors
	//Linear(PortManager& portManager);
	Linear(PortManager& portManager, String name/*, String port*/);
	
	// destructor
	virtual ~Linear();
	
	// getters / setters
	virtual Type getType();
	virtual const String& getStringType() const;
	virtual void updatePort();
	int getMin();
	int getMax();
	int getValue();
	void setValues(int min, int max, int value);
	
private:
	// variables
	int min;
	int max;
	int value;
};

#endif /* LINEAR_H_ */
